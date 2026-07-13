import { QueryStringBuilder } from "../lib/query-string-builder.ts";

export type ApiMethodMapType = {
	current: string;
	forecast: string;
	search: string;
	history: string;
};

export type FetchRequest = {
	method: ApiMethodMapType;
	queryString: QueryStringBuilder;
};

export type ApiBoolean = 0 | 1;

export type ApiCondition = {
	text: string;
	code: number;
	/**
	 * CDN HTTP URL to the icon for the condition
	 */
	icon: string;
};

export type ApiLocation = {
	name: string;
	region: string;
	country: string;
	// latitude
	lat: number;
	//longitude
	lon: number;
	// timezone identifier
	tz_id: string;
	/**
	 * Formatted as YYYY-MM-DD HH:mm
	 */
	localtime: string;
};

export type ApiCurrent = {
	temp_c: number;
	feelslike_c: number;
	temp_f: number;
	feelslike_f: number;
	/**
	 * Formatted as YYYY-MM-DD HH:mm
	 */
	last_updated: string;
	/**
	 * Is it currently day time (is the sun out)
	 */
	is_day: ApiBoolean;
	condition: ApiCondition;
	wind_kph: number;
	humidity: number;
};

export type ApiForecastResponse = {
	location: ApiLocation;
	current: ApiCurrent;
	forecast: { forecastday: ApiForecastDay[] };
};

export type ApiHistoryResponse = {
	location: ApiLocation;
	forecast: { forecastday: ApiForecastDay[] };
};

export type ApiHour = {
	/**
	 * Formatted as YYYY-MM-DD HH:mm
	 */
	time: string;
	temp_c: number;
	temp_f: number;
	is_day: ApiBoolean;
	condition: ApiCondition;
	wind_kph: number;
	will_it_rain: ApiBoolean;
	chance_of_rain: number;
};

export type ApiDay = {
	maxtemp_c: number;
	maxtemp_f: number;
	mintemp_c: number;
	mintemp_f: number;
	avgtemp_c: number;
	avgtemp_f: number;
	maxwind_kph: number;
	avghumidity: number;
	daily_will_it_rain: ApiBoolean;
	daily_chance_of_rain: number;
	condition: ApiCondition;
};

export type ApiAstro = {
	/**
	 * Formatted as hh:mm A
	 */
	sunrise: string;
	/**
	 * Formatted as hh:mm A
	 */
	sunset: string;
};

export type ApiForecastDay = {
	/**
	 * Formatted as YYYY-MM-DD
	 */
	date: string;
	day: ApiDay;
	astro: ApiAstro;
	hour: ApiHour[];
};

/** One row of search.json */
export type ApiSearchCityResult = {
	id: number;
	name: string;
	region: string;
	country: string;
	// latitude
	lat: number;
	//longitude
	lon: number;
	/**
	 * Can be used in the query for the request to get the exact location searched for
	 */
	url: string;
};
