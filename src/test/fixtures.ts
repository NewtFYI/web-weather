import type { Temp, WeatherCondition, WeatherDay, WeatherReading } from "../types/weather.ts";

const sunny: WeatherCondition = {
	text: "Sunny",
	code: 1000,
	iconUrl: "//cdn.weatherapi.com/weather/64x64/day/113.png",
};

const temp = (c: number, f: number): Temp => ({ c, f });

export function makeReading(overrides: Partial<WeatherReading> = {}): WeatherReading {
	return {
		epoch: 1_783_904_400_000,
		time: "2026-07-13 01:00",
		temp: temp(21, 69),
		feelsLike: temp(24, 80),
		isDay: true,
		condition: sunny,
		rainChance: 0,
		rainWill: false,
		...overrides,
	};
}

export function makeDay(overrides: Partial<WeatherDay> = {}, hourCount = 24): WeatherDay {
	const date = overrides.date ?? "2026-07-13";

	const hours: WeatherReading[] =
		overrides.hours ??
		Array.from({ length: hourCount }, (_, hour) =>
			makeReading({
				epoch: 1_783_900_800_000 + hour * 3600,
				time: `${date} ${String(hour).padStart(2, "0")}:00`,
				temp: temp(10 + hour, 50 + hour), // gently rising temps so different hours are distinguishable
				isDay: hour >= 6 && hour < 18, // natural day and night cycle
			}),
		);

	return {
		epoch: 1_783_900_800_000,
		date,
		summary: {
			min: temp(19, 66),
			max: temp(29, 90),
			avg: temp(25, 78),
			condition: sunny,
			rainChance: 9,
			rainWill: false,
		},
		hours,
		...overrides,
	};
}
