import LoadingRetry from "./components/LoadingRetry.tsx";
import { useWeather } from "./hooks/useWeather.ts";

function App() {
	const { status, data, error, refresh } = useWeather("Johannesburg");

	if (!data) {
		return <LoadingRetry retry={refresh} status={status} error={error} />;
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
