import type { ApiForecastResponse } from "./api.ts";

export type TempUnit = "C" | "F";

export type WeatherStatus = "loading" | "ready" | "error";

export type WeatherState = {
	status: WeatherStatus;
	data?: ApiForecastResponse;
	error?: string;
};
