import type { ApiForecastResponse } from "../types/api.ts";
import type { WeatherData } from "../types/weather.ts";

export function mapWeatherForecast({ current, location }: ApiForecastResponse): WeatherData {
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
