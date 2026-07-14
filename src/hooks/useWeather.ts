import { useCallback, useEffect, useState } from "react";
import { loadCurrent } from "../api/client.ts";
import type { WeatherState } from "../types/weather.ts";
import { mapWeatherForecast } from "../utils/mapping.ts";

export function useWeather(location: string) {
	const [state, setState] = useState<WeatherState>({ status: "loading" });
	const [refreshMarker, setRefreshMarker] = useState(0);

	useEffect(() => {
		let alive = true;
		if (refreshMarker < 0 || !alive) {
			return;
		}
		setState(() => ({ status: "loading" }));
		loadCurrent({
			queryParams: {
				q: location,
			},
		})
			// TODO consider async await
			.then((data) => {
				setTimeout(() => {
					if (alive) {
						if (refreshMarker > 1) {
							setState({ status: "ready", data: mapWeatherForecast(data) });
						} else {
							setState({ status: "error", error: "Unauthorized" });
						}
					}
				}, 2000);
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
