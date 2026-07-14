import { mapCity, mapForecast } from "../mappers/weather.ts";
import localForecastData from "../mock/jhb/forecast.json";
import localCityData from "../mock/search/cities.json";
import type { ApiForecastResponse, ApiSearchCityResult, FetchRequest } from "../types/api.ts";
import type { WeatherCity, WeatherForecastData } from "../types/weather.ts";

const API_BASE = "https://api.weatherapi.com/v1" as const;

const ApiMethodMap = {
	forecast: "forecast.json",
	search: "search.json",
	history: "history.json",
} as const;

function fetchLocalData<TResponse>(method: string, { queryParams }: FetchRequest): TResponse {
	if (method === ApiMethodMap.search) {
		return localCityData.filter((city) => city.name.toLowerCase().includes(queryParams.q.toLowerCase())).slice(0, 5) as TResponse;
	}
	if (method === ApiMethodMap.forecast) {
		return localForecastData as TResponse;
	}

	return null as TResponse;
}

async function fetchWithAuth<TResponse>(method: string, request: FetchRequest): Promise<TResponse> {
	const { queryParams } = request;
	// check if we should hit the actual API
	const isProd = import.meta.env.VITE_IS_DEVELOPMENT !== "true";
	if (!isProd) {
		return fetchLocalData<TResponse>(method, request);
	}

	const queryString = new URLSearchParams({ key: import.meta.env.VITE_WEATHER_API_KEY ?? "", ...queryParams });
	const response = await fetch(`${API_BASE}/${method}?${queryString}`);

	if (!response.ok) {
		if (response.status === 401) {
			throw new Error("Unauthorized");
		}
		throw new Error("API Request Failed");
	}

	const responseJson = await response.json();
	return responseJson as TResponse;
}

export async function loadForecast(request: FetchRequest): Promise<WeatherForecastData> {
	const apiResult = await fetchWithAuth<ApiForecastResponse>(ApiMethodMap.forecast, request);
	return mapForecast(apiResult);
}

export async function searchCity(request: FetchRequest): Promise<WeatherCity[]> {
	const apiResult = await fetchWithAuth<ApiSearchCityResult[]>(ApiMethodMap.search, request);
	return apiResult.map((city) => mapCity(city));
}
