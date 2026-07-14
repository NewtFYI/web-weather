import type { WeatherCity, WeatherLocation } from "../../types/weather.ts";
import { CitySearch } from "../CitySearch/CitySearch.tsx";
import Separator from "../Separator/Separator.tsx";

type LocationHeaderProps = {
	location: WeatherLocation;
	manualCity?: string;
	onCitySelected: (city: WeatherCity) => void;
};

export function LocationHeader({ location, manualCity, onCitySelected }: LocationHeaderProps) {
	return (
		<header>
			<div>
				<h1 className="text-4xl font-bold text-slate-100">{manualCity ?? location.name}</h1>
				<p className="mt-1 text-base text-slate-400">
					{location.region} <Separator /> Wednesday
				</p>
				<CitySearch onSelect={onCitySelected} />
			</div>
		</header>
	);
}
