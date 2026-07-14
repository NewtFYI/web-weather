import type { ApiForecastResponse, ApiSearchCityResult } from "../types/api.ts";
import type { WeatherCity, WeatherCurrentData, WeatherForecastData } from "../types/weather.ts";

export function mapWeatherForecast({ current, location, forecast: { forecastday } }: ApiForecastResponse): WeatherForecastData {
	const date = new Date(forecastday[0].date);
	const label = new Intl.DateTimeFormat("en", { weekday: "long" }).format(date);

	return {
		current: {
			conditionText: current.condition.text,
			isDay: current.is_day === 1,
			max: 0,
			min: 0,
			feelsLike: current.feelslike_c,
			heroTemp: current.feelslike_c,
			dateLabel: label,
		},
		location: {
			name: location.name,
			region: location.region,
			timezoneId: location.tz_id,
		},
		forecast: {
			day: {
				conditionText: forecastday[0].day.condition.text,
				isDay: current.is_day === 1,
				max: 0,
				min: 0,
				feelsLike: current.feelslike_c,
				heroTemp: current.feelslike_c,
			},
			epoch: forecastday[0].date_epoch,
			hours: forecastday[0].hour.map((hour) => ({
				epoch: hour.time_epoch,
				isDay: hour.is_day === 1,
				rainChance: hour.chance_of_rain,
				rainIs: hour.will_it_rain === 1,
				temp: hour.temp_c,
			})),
		},
	};
}

export function mapWeatherCurrent({ current, location }: ApiForecastResponse): WeatherCurrentData {
	return {
		current: {
			conditionText: current.condition.text,
			isDay: current.is_day === 1,
			max: 0,
			min: 0,
			feelsLike: current.feelslike_c,
			heroTemp: current.feelslike_c,
		},
		location: {
			name: location.name,
			region: location.region,
			timezoneId: location.tz_id,
		},
	};
}

export function mapWeatherCity({ name, url, region, country }: ApiSearchCityResult): WeatherCity {
	return {
		name,
		url,
		region,
		country,
	};
}
