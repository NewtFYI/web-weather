import type { ApiForecastResponse, LoadingStatus } from "./api.ts";

export type TempUnit = "C" | "F";

export type WeatherState = {
	status: LoadingStatus;
	data?: ApiForecastResponse;
	error?: string;
};

export type WeatherDay = {
	heroTemp: number;
	min: number;
	max: number;
	conditionText: string;
};
