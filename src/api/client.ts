import type { ApiMethodMapType, FetchRequest } from "../types/api.ts";

const API_BASE = "https://api.weatherapi.com/v1" as const;

export const ApiMethodMap: ApiMethodMapType = {
	current: "current.json",
	forecast: "forecast.json",
	search: "search.json",
	history: "history.json",
} as const;

async function fetchWithAuth<TResponse>({ method, queryString }: FetchRequest): Promise<TResponse> {
	queryString.addQueryString("key", import.meta.env.VITE_WEATHER_API_KEY);
	const response = await fetch(`${API_BASE}/${method}?${queryString.build()}`);

	if (!response.ok) {
		if (response.status === 401) {
			throw new Error("Unauthorized");
		}
		throw new Error("API Request Failed");
	}

	const responseJson = await response.json();
	return responseJson as TResponse;
}
