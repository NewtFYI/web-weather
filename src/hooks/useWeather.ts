import { useCallback, useEffect, useState } from "react";
import { loadCurrent } from "../api/client.ts";
import type { WeatherState } from "../types/weather.ts";
import { mapWeatherForecast } from "../utils/mapping.ts";

export function useWeather(location: string) {
	const [state, setState] = useState<WeatherState>({ status: "loading" });
	const [refreshMarker, setRefreshMarker] = useState(0);

	useEffect(() => {
		if (refreshMarker < 0) {
			return;
		}
		let alive = true;
		setState(() => ({ status: "loading" }));
		loadCurrent({
			queryParams: {
				q: location,
			},
		})
			// TODO consider async await
			.then((data) => {
				if (alive) {
					setState({ status: "ready", data: mapWeatherForecast(data) });
				}
			})
			.catch((err: unknown) => {
				if (alive) {
					setState({ status: "error", error: err instanceof Error ? err.message : String(err) });
				}
			});
		return () => {
			alive = false;
		};
	}, [location, refreshMarker]);

	const refresh = useCallback(() => setRefreshMarker((r) => r + 1), []);
	return { ...state, refresh };
}
