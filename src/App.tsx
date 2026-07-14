import { useEffect, useState } from "react";
import Hero from "./components/Hero/Hero.tsx";
import LoadingRetry from "./components/LoadingRetry/LoadingRetry.tsx";
import { LocationHeader } from "./components/LocationHeader/LocationHeader.tsx";
import { useWeather } from "./hooks/useWeather.ts";
import type { TempUnit, WeatherCity, WeatherDay, WeatherLocation } from "./types/weather.ts";

function App() {
	const [weatherSearch, setWeatherSearch] = useState<string>("Johannesburg");
	const [selectedUnit, setSelectedUnit] = useState<TempUnit>("C");
	// TODO remove defaults, should not be necessary
	const [weatherData, setWeatherData] = useState<WeatherDay>({
		heroTemp: 21,
		max: 27,
		min: 20,
		feelsLike: 22,
		isDay: true,
		conditionText: "Hogwash",
	});
	const [locationData, setLocationData] = useState<WeatherLocation>({
		region: "My House",
		timezoneId: "Africa/Johannesburg",
		name: "Home",
	});

	const { status, data, error, refresh } = useWeather(weatherSearch);

	useEffect(() => {
		switch (selectedUnit) {
			case "C": {
				// TODO use correct values
				setWeatherData({
					heroTemp: data?.current.heroTemp ?? 0,
					max: data?.current.max ?? 0,
					min: data?.current.max ?? 0,
					feelsLike: data?.current.feelsLike ?? 0,
					isDay: data?.current.isDay ?? false,
					conditionText: data?.current.conditionText ?? "",
				});
				break;
			}
			case "F": {
				// TODO use correct values
				setWeatherData({
					heroTemp: data?.current.heroTemp ?? 0,
					max: data?.current.max ?? 0,
					min: data?.current.min ?? 0,
					feelsLike: data?.current.feelsLike ?? 0,
					isDay: data?.current.isDay ?? false,
					conditionText: data?.current.conditionText ?? "",
				});
				break;
			}
		}
	}, [selectedUnit, data]);

	useEffect(() => {
		if (data) {
			// default to C
			// TODO use correct values
			setWeatherData({
				heroTemp: data?.current.heroTemp ?? 0,
				max: data?.current.max ?? 0,
				min: data?.current.max ?? 0,
				feelsLike: data?.current.feelsLike ?? 0,
				isDay: data?.current.isDay ?? false,
				conditionText: data?.current.conditionText ?? "",
			});

			setLocationData({
				name: data?.location.name,
				timezoneId: data?.location.timezoneId,
				region: data?.location.region,
			});
		}
	}, [data]);

	const onSelectCity = (city: WeatherCity) => {
		// the url from the search gives us the exact search that the user selected
		setWeatherSearch(city.url);
	};

	if (!data) {
		return <LoadingRetry retry={refresh} status={status} error={error} />;
	}

	return (
		<div className="relative mx-auto flex min-h-screen max-w-270 flex-col pt-10 pb-10">
			<LocationHeader location={locationData} manualCity={weatherSearch} onCitySelected={onSelectCity} />
			<Hero day={weatherData} unit={selectedUnit} onUnitChange={(unit) => setSelectedUnit(unit)} />
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
