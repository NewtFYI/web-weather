export type TempUnit = "C" | "F";
export type Temp = { c: number; f: number };

export type WeatherState = { status: "loading" } | { status: "ready"; data: WeatherForecastData } | { status: "error"; error?: string };

export type WeatherCondition = {
	text: string;
	code: number;
	iconUrl: string;
};

export type WeatherReading = {
	epoch: number;
	temp: Temp;
	feelsLike: Temp;
	isDay: boolean;
	condition: WeatherCondition;
	rainChance: number;
	rainWill: boolean;
};

export type WeatherDaySummary = {
	min: Temp;
	max: Temp;
	condition: WeatherCondition;
	rainChance: number;
	rainWill: boolean;
};

export type WeatherDay = {
	epoch: number;
	/**
	 * Stored as YYYY-MM-DD
	 */
	date: string;
	summary: WeatherDaySummary;
	hours: WeatherReading[];
};

export type WeatherLocation = {
	name: string;
	region: string;
	timezoneId: string;
};

export type WeatherForecastData = {
	location: WeatherLocation;
	current: WeatherReading;
	days: WeatherDay[];
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
