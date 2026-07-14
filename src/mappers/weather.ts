import type {
	ApiCondition,
	ApiCurrent,
	ApiDay,
	ApiForecastDay,
	ApiForecastResponse,
	ApiHistoryResponse,
	ApiHour,
	ApiLocation,
	ApiSearchCityResult,
} from "../types/api.ts";
import type { WeatherCity, WeatherCondition, WeatherDay, WeatherDaySummary, WeatherForecastData, WeatherLocation, WeatherReading, } from "../types/weather.ts";

const mapTemp = (celsius: number, fahrenheit: number) => ({ c: celsius, f: fahrenheit });

function mapCondition({ text, code, icon }: ApiCondition): WeatherCondition {
	return { text, code, iconUrl: `https:${icon}` };
}

function mapLocation({ name, region, tz_id }: ApiLocation): WeatherLocation {
	return { name, region, timezoneId: tz_id };
}

function mapCurrent(current: ApiCurrent): WeatherReading {
	return {
		epoch: current.last_updated_epoch,
		time: current.last_updated,
		temp: mapTemp(current.temp_c, current.temp_f),
		feelsLike: mapTemp(current.feelslike_c, current.feelslike_f),
		isDay: current.is_day === 1,
		condition: mapCondition(current.condition),
		rainChance: current.chance_of_rain,
		rainWill: current.will_it_rain === 1,
	};
}

function mapHour(hour: ApiHour): WeatherReading {
	return {
		epoch: hour.time_epoch,
		time: hour.time,
		temp: mapTemp(hour.temp_c, hour.temp_f),
		feelsLike: mapTemp(hour.feelslike_c, hour.feelslike_f),
		isDay: hour.is_day === 1,
		condition: mapCondition(hour.condition),
		rainChance: hour.chance_of_rain,
		rainWill: hour.will_it_rain === 1,
	};
}

function mapDaySummary(day: ApiDay): WeatherDaySummary {
	return {
		min: mapTemp(day.mintemp_c, day.mintemp_f),
		max: mapTemp(day.maxtemp_c, day.maxtemp_f),
		condition: mapCondition(day.condition),
		rainChance: day.daily_chance_of_rain,
		rainWill: day.daily_will_it_rain === 1,
	};
}

export function mapDay(forecastDay: ApiForecastDay): WeatherDay {
	return {
		epoch: forecastDay.date_epoch,
		date: forecastDay.date,
		summary: mapDaySummary(forecastDay.day),
		hours: forecastDay.hour.map(mapHour),
	};
}

export function mapForecast(response: ApiForecastResponse): WeatherForecastData {
	return {
		location: mapLocation(response.location),
		current: mapCurrent(response.current),
		days: response.forecast.forecastday.map(mapDay),
	};
}

export function mapHistoryDays(response: ApiHistoryResponse): WeatherDay[] {
	return response.forecast.forecastday.map(mapDay);
}

export function mapCity({ name, url, region, country }: ApiSearchCityResult): WeatherCity {
	return { name, url, region, country };
}
