import type { WeatherCity, WeatherDay, WeatherLocation } from "../../types/weather.ts";
import { CitySearch } from "../CitySearch/CitySearch.tsx";
import Separator from "../Separator/Separator.tsx";

type LocationHeaderProps = {
	location: WeatherLocation;
	// TODO - need to clean this logic up to get the current tile's date
	current?: WeatherDay | undefined;
	onCitySelected: (city: WeatherCity) => void;
};

export function LocationHeader({ location, onCitySelected, current }: LocationHeaderProps) {
	return (
		<header>
			<div>
				<h1 className="text-4xl font-bold text-slate-100">{location.name}</h1>
				<p className="mt-1 text-base text-slate-400">
					{location.region} <Separator /> {current?.dateLabel ?? "No day"}
				</p>
				<CitySearch onSelect={onCitySelected} />
			</div>
		</header>
	);
}
