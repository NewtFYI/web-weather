import type { LoadingStatus } from "./api.ts";

export type TempUnit = "C" | "F";

export type WeatherState = {
	status: LoadingStatus;
	data?: WeatherForecastData;
	error?: string;
};

export type WeatherCurrentData = {
	current: WeatherDay;
	location: WeatherLocation;
};

export type WeatherForecastData = WeatherCurrentData & {
	forecast: WeatherForecast;
};

export type WeatherForecast = {
	epoch: number;
	day: WeatherDay;
	hours: WeatherHour[];
};

export type WeatherHour = {
	epoch: number;
	temp: number;
	isDay: boolean;
	rainIs: boolean;
	rainChance: number;
};

export type WeatherDay = {
	heroTemp: number;
	feelsLike: number;
	isDay: boolean;
	min: number;
	max: number;
	conditionText: string;
	dateLabel?: string;
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
