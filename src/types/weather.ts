import type { LoadingStatus } from "./api.ts";

export type TempUnit = "C" | "F";

export type WeatherState = {
	status: LoadingStatus;
	data?: WeatherData;
	error?: string;
};

export type WeatherData = {
	current: WeatherDay;
	location: WeatherLocation;
};

export type WeatherDay = {
	heroTemp: number;
	feelsLike: number;
	isDay: boolean;
	min: number;
	max: number;
	conditionText: string;
};

export type WeatherLocation = {
	name: string;
	region: string;
	timezoneId: string;
};

export type WeatherCity = {
	name: string;
	region: string;
	country: string;
	/**
	 * Can be used in the query for the request to get the exact location searched for
	 */
	url: string;
};
