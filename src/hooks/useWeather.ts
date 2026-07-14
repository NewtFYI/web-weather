import { useCallback, useEffect, useState } from "react";
import { loadForecast } from "../api/client.ts";
import type { WeatherState } from "../types/weather.ts";

export function useWeather(location: string) {
	const [state, setState] = useState<WeatherState>({ status: "loading" });
	const [refreshMarker, setRefreshMarker] = useState(0);

	// biome-ignore lint/correctness/useExhaustiveDependencies: refreshMarker is used to determine if we should hit the api again, it's an external managed update
	useEffect(() => {
		let alive = true;
		setState({ status: "loading" });

		loadForecast({ queryParams: { q: location } })
			.then((data) => {
				if (alive) setState({ status: "ready", data });
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
