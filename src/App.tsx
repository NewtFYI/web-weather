import { useState } from "react";
import { Hero } from "./components/Hero/Hero.tsx";
import { HourlyRail } from "./components/HourlyRail/HourlyRail.tsx";
import { LoadingRetry } from "./components/LoadingRetry/LoadingRetry.tsx";
import { LocationHeader } from "./components/LocationHeader/LocationHeader.tsx";
import { WeekRail } from "./components/WeekRail/WeekRail.tsx";
import { useWeather } from "./hooks/useWeather.ts";
import type { TempUnit, WeatherCity } from "./types/weather.ts";

export function App() {
	const [weatherSearch, setWeatherSearch] = useState("Johannesburg");
	const [selectedUnit, setSelectedUnit] = useState<TempUnit>("C");
	const [selectedDate, setSelectedDate] = useState<string | null>(null);
	const weather = useWeather(weatherSearch);

	const onSelectCity = (city: WeatherCity) => {
		// the url from the search gives us the exact search that the user selected
		setWeatherSearch(city.url);
		// reset to today when the location changes
		setSelectedDate(null);
	};

	if (weather.status !== "ready") {
		return <LoadingRetry retry={weather.refresh} status={weather.status} error={weather.status === "error" ? weather.error : undefined} />;
	}

	const { location, days, today } = weather.data;
	const activeDate = selectedDate ?? today;
	const activeDay = days.find((d) => d.date === activeDate) ?? days[0];
	const isToday = activeDay.date === today;

	return (
		<div className="relative mx-auto flex min-h-screen max-w-270 flex-col pt-10 pb-10">
			<LocationHeader location={location} day={activeDay} onCitySelected={onSelectCity} />
			<Hero day={activeDay} unit={selectedUnit} onUnitChange={setSelectedUnit} />
			<HourlyRail day={activeDay} unit={selectedUnit} isToday={isToday} />
			<WeekRail days={days} today={today} selectedDate={activeDate} unit={selectedUnit} onSelect={setSelectedDate} />
			<footer className="mt-auto flex items-center gap-1 pt-2 text-xs text-slate-500">
				Powered by{" "}
				<a href="https://www.weatherapi.com/" title="Free Weather API">
					WeatherAPI.com
				</a>
			</footer>
		</div>
	);
}
