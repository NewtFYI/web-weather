import { describe, expect, it } from "vitest";
import type { ApiForecastResponse } from "../types/api.ts";
import { mapForecast } from "./weather.ts";

/**
 * Minimal but essential API response. We include only the fields the mapper reads.
 * If the mapper starts reading a new field, the test will fail loudly (undefined), which is the signal we want, so that we know to update the mappers
 */
function mockSimpleApiResponse(): ApiForecastResponse {
	return {
		location: {
			name: "Port Elizabeth",
			region: "Eastern Cape",
			country: "South Africa",
			lat: -33.96,
			lon: 25.58,
			tz_id: "Africa/Johannesburg",
			localtime: "2026-07-15 01:12",
		},
		current: {
			last_updated_epoch: 1784070000,
			last_updated: "2026-07-15 01:00",
			temp_c: 12.1,
			feelslike_c: 10.7,
			temp_f: 53.8,
			feelslike_f: 51.2,
			is_day: 0,
			condition: { text: "Clear", code: 1000, icon: "//cdn.weatherapi.com/weather/64x64/night/113.png" },
			chance_of_rain: 13,
			will_it_rain: 0,
			wind_kph: 13.3,
			humidity: 100,
		},
		forecast: {
			forecastday: [
				{
					date: "2026-07-15",
					date_epoch: 1784016000,
					day: {
						maxtemp_c: 18.2,
						maxtemp_f: 64.8,
						mintemp_c: 13.1,
						mintemp_f: 55.6,
						avgtemp_c: 15.5,
						avgtemp_f: 59.9,
						maxwind_kph: 20,
						avghumidity: 80,
						daily_will_it_rain: 1,
						daily_chance_of_rain: 9,
						condition: { text: "Sunny", code: 1000, icon: "//cdn.weatherapi.com/weather/64x64/day/113.png" },
					},
					astro: { sunrise: "07:00 AM", sunset: "05:30 PM" },
					hour: [
						{
							time: "2026-07-15 00:00",
							hour: 0,
							time_epoch: 1784016000,
							temp_c: 14.1,
							feelslike_c: 13,
							temp_f: 57.3,
							feelslike_f: 55.4,
							is_day: 0,
							condition: { text: "Clear", code: 1000, icon: "//cdn.weatherapi.com/weather/64x64/night/113.png" },
							wind_kph: 10,
							will_it_rain: 0,
							chance_of_rain: 13,
						},
					],
				},
			],
		},
	};
}

/**
 * Key points for this test
 *   - The mapper flips API 0/1 integers into real booleans (is_day, will_it_rain)
 *   - The mapper prefixes icon URLs with "https:" (the API returns protocol-relative "//cdn...")
 *   - The mapper renames fields (tz_id -> timezoneId) and nests them differently
 * Additionally, if new data is mapped but doesn't come from the API or vice versa, we know something needs to change
 */
describe("mapForecast", () => {
	it("maps location fields and renames tz_id to timezoneId", () => {
		const result = mapForecast(mockSimpleApiResponse());

		expect(result.location).toEqual({
			name: "Port Elizabeth",
			region: "Eastern Cape",
			timezoneId: "Africa/Johannesburg",
		});
	});

	it("converts the API's 0/1 integers into real booleans", () => {
		const result = mapForecast(mockSimpleApiResponse());

		// current.is_day = 0 => false
		expect(result.current.isDay).toBe(false);
		// the day summary's daily_will_it_rain = 1 => true
		expect(result.days[0].summary.rainWill).toBe(true);
	});

	it("keeps both C and F so the unit toggle has data to switch between", () => {
		const result = mapForecast(mockSimpleApiResponse());

		expect(result.current.temp).toEqual({ c: 12.1, f: 53.8 });
	});

	it("prefixes the protocol-relative icon URL with https:", () => {
		const result = mapForecast(mockSimpleApiResponse());

		expect(result.current.condition.iconUrl).toBe("https://cdn.weatherapi.com/weather/64x64/night/113.png");
	});

	it("maps the hour list and derives `today` from the first forecast day", () => {
		const result = mapForecast(mockSimpleApiResponse());

		expect(result.today).toBe("2026-07-15");
		expect(result.days[0].hours).toHaveLength(1);
		expect(result.days[0].hours[0].temp).toEqual({ c: 14.1, f: 57.3 });
	});
});
