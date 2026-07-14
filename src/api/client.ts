import { previousDates } from "../formatters/time.ts";
import { mapCity, mapForecast, mapHistoryDays } from "../mappers/weather.ts";
import localHistory0710 from "../mock/jhb/2026-07-10.json";
import localHistory0711 from "../mock/jhb/2026-07-11.json";
import localHistory0712 from "../mock/jhb/2026-07-12.json";
import localForecastData from "../mock/jhb/forecast.json";
import localCityData from "../mock/search/cities.json";
import {
  type ApiForecastResponse,
  type ApiHistoryResponse,
  type ApiQueryRequest,
  type ApiSearchCityResult,
  type BaseFetchRequest,
  type ForecastFetchRequest,
  type HistoryFetchRequest,
  mapBaseFetchToApiQuery,
  mapFetchToApiQuery,
  mapHistoryFetchToApiQuery,
} from "../types/api.ts";
import type { WeatherCity, WeatherDay, WeatherForecastData } from "../types/weather.ts";

const API_BASE = "https://api.weatherapi.com/v1" as const;

const HISTORY_DAYS = 3 as const;
const FORECAST_DAYS = 4 as const;

const apiMethodOptions = ["forecast.json", "search.json", "history.json"] as const;
type ApiMethod = (typeof apiMethodOptions)[number];

const localHistoryByDate: Record<string, unknown> = {
	"2026-07-10": localHistory0710,
	"2026-07-11": localHistory0711,
	"2026-07-12": localHistory0712,
};

function fetchLocalData<TResponse>(method: ApiMethod, { q, dt }: ApiQueryRequest): TResponse {
	switch (method) {
		case "forecast.json": {
			return localForecastData as TResponse;
		}
		case "search.json": {
			return localCityData.filter((city) => city.name.toLowerCase().includes(q.toLowerCase())).slice(0, 5) as TResponse;
		}
		case "history.json": {
			const mock = dt ? localHistoryByDate[dt] : undefined;
			if (!mock) {
				throw new Error(`No history mock for ${dt ?? "(no date)"}`);
			}
			return mock as TResponse;
		}
		default:
			throw new Error(`No local data for ${method}`);
	}
}

async function fetchWithAuth<TResponse>(method: ApiMethod, request: ApiQueryRequest): Promise<TResponse> {
	const useMock = import.meta.env.VITE_IS_DEVELOPMENT === "true";
	if (useMock) {
		return fetchLocalData<TResponse>(method, request);
	}

	const queryString = new URLSearchParams({
		key: import.meta.env.VITE_WEATHER_API_KEY ?? "",
		...request,
	});
	const response = await fetch(`${API_BASE}/${method}?${queryString}`);

	if (!response.ok) {
		if (response.status === 401) {
			throw new Error("Unauthorized");
		}
		throw new Error("API Request Failed");
	}

	return (await response.json()) as TResponse;
}

async function fetchHistoryDay(request: HistoryFetchRequest): Promise<WeatherDay[]> {
	const apiResult = await fetchWithAuth<ApiHistoryResponse>("history.json", mapHistoryFetchToApiQuery(request));
	return mapHistoryDays(apiResult);
}

/**
 * Loads a full week forecast, which is a sum total of 7 days based on `HISTORY_DAYS` being 3.
 * This is then merged into a single chronological `days` array for the week rail.
 *
 * History is fanned out one request per day because the free tier rejects a date range.
 * If any history day fails we still return the forecast, because a shorter rail is better than no weather at all.
 */
export async function loadForecast(request: ForecastFetchRequest): Promise<WeatherForecastData> {
	// validate that we can do a valid forecast with the params provided
	if (!request.forecastDays || request.forecastDays <= 0) {
		request.forecastDays = FORECAST_DAYS;
	}

	const forecastResult = await fetchWithAuth<ApiForecastResponse>("forecast.json", mapFetchToApiQuery(request));
	const forecast = mapForecast(forecastResult);

	const today = forecast.days[0]?.date;
	if (!today) {
		return forecast;
	}

	const settled = await Promise.allSettled(
		previousDates(today, HISTORY_DAYS).map((date) =>
			fetchHistoryDay({
				locationSearch: request.locationSearch,
				historyDate: date,
			}),
		),
	);

	const history = settled
		.filter((promiseResult): promiseResult is PromiseFulfilledResult<WeatherDay[]> => promiseResult.status === "fulfilled")
		.flatMap((r) => r.value);

	return {
		...forecast,
		days: [...history, ...forecast.days].sort((a, b) => a.epoch - b.epoch),
	};
}

export async function searchCity(request: BaseFetchRequest): Promise<WeatherCity[]> {
	const apiResult = await fetchWithAuth<ApiSearchCityResult[]>("search.json", mapBaseFetchToApiQuery(request));
	return apiResult.map(mapCity);
}
