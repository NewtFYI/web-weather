import { useEffect, useState } from "react";
import Hero from "./components/Hero.tsx";
import LoadingRetry from "./components/LoadingRetry.tsx";
import { useWeather } from "./hooks/useWeather.ts";
import type { TempUnit } from "./types/weather.ts";

function App() {
	const [selectedUnit, setSelectedUnit] = useState<TempUnit>("C");
	// TODO remove defaults, should not be necessary
	const [weatherData, setWeatherData] = useState<{ heroTemp: number; min: number; max: number }>({ heroTemp: 22, min: 18, max: 28 });

	const { status, data, error, refresh } = useWeather("Johannesburg");

	useEffect(() => {
		switch (selectedUnit) {
			case "C": {
				// TODO use correct values
				setWeatherData({
					heroTemp: data?.current.temp_c ?? 0,
					max: data?.current.temp_c ?? 0,
					min: data?.current.temp_c ?? 0,
				});
				break;
			}
			case "F": {
				// TODO use correct values
				setWeatherData({
					heroTemp: data?.current.temp_f ?? 0,
					max: data?.current.temp_f ?? 0,
					min: data?.current.temp_f ?? 0,
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
				heroTemp: data?.current.temp_c ?? 0,
				max: data?.current.temp_c ?? 0,
				min: data?.current.temp_c ?? 0,
			});
		}
	}, [data]);

	if (!data) {
		return <LoadingRetry retry={refresh} status={status} error={error} />;
	}

	// TODO - remove main-container or add styling
	return (
		<div className="main-container">
			<div className="relative z-2 mx-auto flex min-h-screen max-w-270 flex-col pt-10 pb-10">
				<Hero
					day={{ conditionText: "cold and miserable", ...weatherData }}
					unit={selectedUnit}
					onUnitChange={(unit) => setSelectedUnit(unit)}
				/>
				<footer className="mt-auto flex items-center gap-2 pt-2 text-xs text-slate-500">
					Powered by{" "}
					<a href="https://www.weatherapi.com/" title="Free Weather API">
						WeatherAPI.com
					</a>
				</footer>
			</div>
		</div>
	);
}

export default App;
