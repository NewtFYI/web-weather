import { Undo2 } from "lucide-react";
import type { WeatherCity, WeatherDay, WeatherLocation } from "../../types/weather.ts";
import { CitySearch } from "../CitySearch/CitySearch.tsx";
import { Separator } from "../Separator/Separator.tsx";

type LocationHeaderProps = {
	location: WeatherLocation;
	day: WeatherDay;
	onCitySelected: (city: WeatherCity) => void;
	isOffToday: boolean;
	onBackToToday: () => void;
};

export function LocationHeader({ location, onCitySelected, day, isOffToday, onBackToToday }: LocationHeaderProps) {
	return (
		<header>
			<div>
				<h1 className="text-4xl font-bold text-slate-100">{location.name}</h1>
				<p className="mt-1 flex flex-wrap items-center gap-2 text-base text-slate-400">
					<span>
						{location.region} <Separator /> {day.date ?? "No day"}
					</span>
					{isOffToday && (
						<button
							type="button"
							onClick={onBackToToday}
							className="inline-flex cursor-pointer items-center gap-2 rounded-full border border-aqua-400/45 bg-aqua-500/15 px-2 py-0.5 text-xs font-semibold text-aqua-300 shadow-glow-aqua"
						>
							<Undo2 size={12} /> Back to today
						</button>
					)}
				</p>
				<CitySearch onSelect={onCitySelected} />
			</div>
		</header>
	);
}
