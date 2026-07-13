import type { ApiMethodMapType, FetchRequest } from "../types/api.ts";

const API_BASE = "https://api.weatherapi.com/v1" as const;

export const ApiMethodMap: ApiMethodMapType = {
	current: "current.json",
	forecast: "forecast.json",
	search: "search.json",
	history: "history.json",
} as const;

export async function fetchWithAuth<TResponse>({ method, queryParams }: FetchRequest): Promise<TResponse> {
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
