import { useWeather } from "./hooks/useWeather.ts";

function App() {
	const { status, data, error, refresh } = useWeather("Johannesburg");

	/* ---- loading / error shells ---- */
	if (!data) {
		return (
			<div className="cx-scene grid min-h-screen place-items-center" data-scene="clear-night">
				{status === "error" ? (
					<div className="flex flex-col items-center gap-4 px-6 text-center">
						<p className="m-0 text-slate-300">Couldn't load weather{error ? ` — ${error}` : ""}.</p>
						<button
							type="button"
							onClick={refresh}
							className="cursor-pointer rounded-full bg-linear-135 from-aqua-500 to-purple-500 px-5 py-2 text-sm font-semibold text-slate-950"
						>
							Try again
						</button>
					</div>
				) : (
					<p className="m-0 animate-pulse text-slate-400">Loading weather…</p>
				)}
			</div>
		);
	}

	return (
		<div className="main-container">
			<div className="relative z-2 mx-auto flex min-h-screen max-w-265 flex-col pt-10 pb-10">
				<div className="flex flex-col">DATA Received! {data.current.condition.text}</div>
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
