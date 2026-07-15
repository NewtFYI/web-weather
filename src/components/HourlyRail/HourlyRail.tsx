import { useEffect, useRef } from "react";
import { dayKind, formatHour, getDateParts } from "../../formatters/time.ts";
import { mapConditionCodeToIcon } from "../../mappers/condition.ts";
import type { TempUnit, WeatherDay } from "../../types/weather.ts";
import { Temperature } from "../Temperature/Temperature.tsx";

type HourlyRailProps = {
	day: WeatherDay;
	unit: TempUnit;
	isToday: boolean;
};

export function HourlyRail({ day, unit, isToday }: HourlyRailProps) {
	const railRef = useRef<HTMLDivElement>(null);
	const now = new Date();

	useEffect(() => {
		const rail = railRef.current;
		if (!rail) return;
		// go to midnight for the day that isn't today
		if (!isToday) {
			rail.scrollTo({ left: 0 });
			return;
		}
		const cell = rail.querySelector<HTMLElement>("[data-now]");
		if (cell) rail.scrollTo({ left: Math.max(0, cell.offsetLeft - 76) });
	}, [isToday]);

	return (
		<div ref={railRef} className="scrollbar-thin-dark relative flex gap-2 overflow-x-auto pb-1 mt-4">
			{day.hours.map((h) => {
				const ConditionIcon = mapConditionCodeToIcon(h.condition.code, h.isDay);
				const hourParts = getDateParts(h.time);
				const nowParts = getDateParts(now.toISOString());
				const isNow = isToday && hourParts.hour === nowParts.hour;
				const typeOfDay = dayKind(h.time, now.toISOString());
				let isPast = false;
				if (isToday) {
					isPast = hourParts.hour < nowParts.hour;
				} else if (typeOfDay === "past") {
					isPast = true;
				} else if (typeOfDay === "future") {
					isPast = false;
				}
				return (
					<div
						key={h.epoch}
						data-now={isNow || undefined}
						className={
							"flex min-w-15 shrink-0 flex-col items-center gap-2 rounded-xl border px-1.5 py-3 backdrop-blur-sm " +
							(isNow ? "border-aqua-400/40 bg-aqua-500/15" : "border-glass-line bg-glass") +
							(isPast ? " opacity-45" : "")
						}
					>
						<span className={`text-xs font-semibold ${isNow ? "text-aqua-300" : "text-slate-400"}`}>
							{isNow ? "Now" : formatHour(h.time)}
						</span>
						<ConditionIcon size={20} className="text-aqua-300" />
						<span className="text-base font-semibold text-slate-100">
							<Temperature display={"value-degree"} unit={unit} value={h.temp} />
						</span>
					</div>
				);
			})}
		</div>
	);
}
