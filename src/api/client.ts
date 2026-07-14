import localCurrentData from "../mock/jhb/current-mock.json";
import type { ApiForecastResponse, FetchRequest } from "../types/api.ts";

const API_BASE = "https://api.weatherapi.com/v1" as const;

const ApiMethodMap = {
	current: "current.json",
	forecast: "forecast.json",
	search: "search.json",
	history: "history.json",
} as const;

function fetchLocalData<TResponse>(method: string): TResponse {
	if (method === ApiMethodMap.current) {
		return localCurrentData as TResponse;
	}

	return null as TResponse;
}

async function fetchWithAuth<TResponse>(method: string, { queryParams }: FetchRequest): Promise<TResponse> {
	// check if we should hit the actual API
	const isProd = import.meta.env.VITE_IS_DEVELOPMENT !== "true";
	if (!isProd) {
		return fetchLocalData<TResponse>(method);
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

export async function loadCurrent(request: FetchRequest): Promise<ApiForecastResponse> {
	return fetchWithAuth<ApiForecastResponse>(ApiMethodMap.current, request);
}
