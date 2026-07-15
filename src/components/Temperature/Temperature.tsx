import "./Temperature.css";
import type { Temp, TempUnit } from "../../types/weather.ts";

type TemperatureProps = {
	value?: Temp;
	display: "value" | "value-degree" | "degree-unit";
	unit: TempUnit;
	isGradient?: boolean;
};

export function Temperature({ value, display, unit, isGradient }: TemperatureProps) {
	// picked up that it returns decimals, like 8.8 -> while helpful, I don't think people see weather temp's in that way
	const tempReading = value ? Math.round(unit === "C" ? value.c : value.f) : 0;

	switch (display) {
		case "value":
			return <span>{tempReading}</span>;
		case "value-degree":
			return (
				<span>
					{tempReading}
					<span className={`${isGradient ? "degree-gradient" : "degree"}`} />
				</span>
			);
		case "degree-unit":
			return (
				<span>
					<span className={`${isGradient ? "degree-gradient" : "degree"}`} />
					{unit}
				</span>
			);
	}
}
