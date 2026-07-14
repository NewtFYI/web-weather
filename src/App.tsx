import { useState } from "react";
import Hero from "./components/Hero/Hero.tsx";
import LoadingRetry from "./components/LoadingRetry/LoadingRetry.tsx";
import { LocationHeader } from "./components/LocationHeader/LocationHeader.tsx";
import { useWeather } from "./hooks/useWeather.ts";
import type { TempUnit, WeatherCity } from "./types/weather.ts";

function App() {
	const [weatherSearch, setWeatherSearch] = useState("Johannesburg");
	const [selectedUnit, setSelectedUnit] = useState<TempUnit>("C");
	const weather = useWeather(weatherSearch);

	const onSelectCity = (city: WeatherCity) => {
		// the url from the search gives us the exact search that the user selected
		setWeatherSearch(city.url);
	};

	if (weather.status !== "ready") {
		return <LoadingRetry retry={weather.refresh} status={weather.status} error={weather.status === "error" ? weather.error : undefined} />;
	}

	const { current, location, days } = weather.data;

	return (
		<div className="relative mx-auto flex min-h-screen max-w-270 flex-col pt-10 pb-10">
			<LocationHeader location={location} day={days[0]} onCitySelected={onSelectCity} />
			<Hero day={days[0]} current={current} unit={selectedUnit} onUnitChange={(unit) => setSelectedUnit(unit)} />
			<ul>
				{days[0].hours.map((hour) => {
					return (
						<div key={hour.epoch}>
							<div>{hour.epoch}</div>
						</div>
					);
				})}
			</ul>
			<footer className="mt-auto flex items-center gap-1 pt-2 text-xs text-slate-500">
				Powered by{" "}
				<a href="https://www.weatherapi.com/" title="Free Weather API">
					WeatherAPI.com
				</a>
			</footer>
		</div>
	);
}

export default App;
