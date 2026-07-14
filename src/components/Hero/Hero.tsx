import type { TempUnit, WeatherDay } from "../../types/weather.ts";
import { tempStr } from "../../utils/format.ts";
import SegmentToggle from "../SegmentToggle/SegmentToggle.tsx";

type HeroProps = {
	day: WeatherDay;
	unit: TempUnit;
	onUnitChange: (unit: TempUnit) => void;
};

function Hero({ day, unit, onUnitChange }: HeroProps) {
	return (
		<section className="flex flex-wrap items-start gap-4">
			<div>
				<div className="text-gradient text-8xl leading-tight font-light tracking-tight">{tempStr(day.heroTemp)}</div>
				<SegmentToggle
					className="mt-4"
					label="Temperature units"
					value={unit}
					onChange={onUnitChange}
					key={unit}
					options={[
						{ value: "C", label: "°C" },
						{ value: "F", label: "°F" },
					]}
				/>
			</div>
			<div className="pt-4 text-sm">
				<div className="mt-3 font-semibold tracking-wider uppercase text-slate-400">{day.conditionText}</div>
				<div className="mt-1 flex gap-3 font-medium">
					<b className="font-semibold text-slate-200">H:{tempStr(day.max)}</b>
					<b className="font-semibold text-slate-200">L:{tempStr(day.min)}</b>
				</div>
			</div>
		</section>
	);
}

export default Hero;
