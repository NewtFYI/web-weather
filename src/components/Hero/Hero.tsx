import type { TempUnit, WeatherDay, WeatherReading } from "../../types/weather.ts";
import { SegmentToggle } from "../SegmentToggle/SegmentToggle.tsx";
import { Temperature } from "../Temperature/Temperature.tsx";

type HeroProps = {
	day: WeatherDay;
	current: WeatherReading;
	unit: TempUnit;
	onUnitChange: (unit: TempUnit) => void;
};

export function Hero({ day, current, unit, onUnitChange }: HeroProps) {
	return (
		<section className="flex flex-wrap items-start gap-4">
			<div>
				<div className="text-gradient text-8xl leading-tight font-light tracking-tight">
					<Temperature value={current.temp} display="value" unit={unit} />
				</div>
				<SegmentToggle
					ariaLabel="Temperature units"
					value={unit}
					onChange={onUnitChange}
					key={unit}
					options={[
						{
							value: "C",
							label: (
								<>
									<Temperature display="degree-unit" unit="C" />
								</>
							),
						},
						{
							value: "F",
							label: (
								<>
									<Temperature display="degree-unit" unit="F" />
								</>
							),
						},
					]}
				/>
			</div>
			<div className="pt-4 text-sm">
				<div className="mt-3 font-semibold tracking-wider uppercase text-slate-400">{day.summary.condition.text}</div>
				<div className="mt-1 flex gap-3 font-medium">
					<b className="font-semibold text-slate-200">
						H: <Temperature value={day.summary.max} display="value-degree" unit={unit} />
					</b>
					<b className="font-semibold text-slate-200">
						L: <Temperature value={day.summary.min} display="value-degree" unit={unit} />
					</b>
				</div>
			</div>
		</section>
	);
}
