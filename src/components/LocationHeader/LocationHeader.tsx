import type { WeatherLocation } from "../../types/weather.ts";
import Separator from "../Separator/Separator.tsx";

type LocationHeaderProps = {
	location: WeatherLocation;
};

export function LocationHeader({ location }: LocationHeaderProps) {
	return (
		<header>
			<div>
				<h1 className="text-4xl font-bold text-slate-100">{location.name}</h1>
				<p className="mt-1 text-base text-slate-400">
					{location.region} <Separator /> Wednesday
				</p>
			</div>
		</header>
	);
}
