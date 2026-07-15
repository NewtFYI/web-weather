import { CalendarRange } from "lucide-react";
import { useEffect, useRef } from "react";
import { dayKind, getDateParts } from "../../formatters/time.ts";
import { mapConditionCodeToIcon } from "../../mappers/condition.ts";
import type { TempUnit, WeatherDay } from "../../types/weather.ts";
import { Temperature } from "../Temperature/Temperature.tsx";

type DayTileProps = {
	day: WeatherDay;
	today: string;
	unit: TempUnit;
	selected: boolean;
	onSelect: () => void;
};

type WeekRailProps = {
	days: WeatherDay[];
	today: string;
	selectedDate: string;
	unit: TempUnit;
	onSelect: (date: string) => void;
};

// internally used component
function DayTile({ day, today, unit, selected, onSelect }: DayTileProps) {
	const { summary } = day;
	const isToday = dayKind(day.date, today) === "today";
	const now = new Date();
	const nowParts = getDateParts(now.toISOString());
	const currentHour = day.hours.find((x) => getDateParts(x.time).hour === nowParts.hour);
	let dayIconMarker: boolean | undefined;
	if (isToday) {
		dayIconMarker = currentHour?.isDay;
	}
	const Icon = mapConditionCodeToIcon(day.summary.condition.code, dayIconMarker);

	let buttonLookAndFeel: string;
	if (isToday)
		buttonLookAndFeel = `${selected ? "today-ring min-w-28 flex-1 shadow-glow-aqua" : "min-w-28 flex-1 border border-glass-line bg-glass backdrop-blur-sm hover:border-glass-line-strong"}`;
	else if (selected) buttonLookAndFeel = "min-w-28 flex-1 border border-aqua-400/55 bg-aqua-500/15 shadow-glow-aqua";
	else buttonLookAndFeel = "min-w-28 flex-1 border border-glass-line bg-glass backdrop-blur-sm hover:border-glass-line-strong";

	return (
		<button
			type="button"
			onClick={onSelect}
			data-anchor={selected || undefined}
			data-today={isToday || undefined}
			aria-current={isToday ? "date" : undefined}
			aria-pressed={selected}
			className={`flex cursor-pointer flex-col items-center justify-center gap-2 rounded-2xl px-2 py-4 transition-colors duration-200 ${buttonLookAndFeel}`}
		>
			{isToday && <span className="text-base font-bold tracking-wider text-aqua-300 uppercase">Today</span>}
			<span className={`text-sm font-semibold ${selected || isToday ? "text-aqua-200" : "text-slate-300"}`}>
				{getDateParts(day.date).shortWeekday}
			</span>
			<Icon size={26} strokeWidth={1.75} />
			<span className="text-xl font-semibold tracking-tight text-slate-100">
				<Temperature display={"value-degree"} unit={unit} value={summary.avg} />
			</span>
			<span className="text-xs text-slate-400">
				<b className="font-semibold text-slate-300">
					<Temperature display={"value-degree"} unit={unit} value={summary.max} />
				</b>
				{" / "}
				<Temperature display={"value-degree"} unit={unit} value={summary.min} />
			</span>
		</button>
	);
}

export function WeekRail({ days, today, selectedDate, unit, onSelect }: WeekRailProps) {
	const railRef = useRef<HTMLDivElement>(null);

	// biome-ignore lint/correctness/useExhaustiveDependencies: if days or selected date changes, we want this to scroll
	useEffect(() => {
		const rail = railRef.current;
		if (!rail) return;
		const anchor = rail.querySelector<HTMLElement>("[data-anchor]") ?? rail.querySelector<HTMLElement>("[data-today]");
		if (!anchor) return;
		const left = Math.max(0, anchor.offsetLeft - (rail.clientWidth - anchor.offsetWidth) / 2);
		rail.scrollTo({ left, behavior: "smooth" });
	}, [selectedDate, days]);

	return (
		<section>
			<h3 className="mt-4 mb-3 flex items-center gap-1 text-xs font-semibold tracking-wider text-slate-400 uppercase">
				<CalendarRange size={14} /> 7-day period
			</h3>
			<div ref={railRef} className="scrollbar-none relative -mx-4 flex gap-2 overflow-x-auto px-6 py-1">
				{days.map((day) => (
					<DayTile
						key={day.date}
						day={day}
						today={today}
						unit={unit}
						selected={day.date === selectedDate}
						onSelect={() => onSelect(day.date)}
					/>
				))}
			</div>
		</section>
	);
}
