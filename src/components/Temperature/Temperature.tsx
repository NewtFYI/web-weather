import "./Temperature.css";
import type { TempUnit } from "../../types/weather.ts";

type TemperatureProps = {
	value?: number | string;
	display: "value" | "value-degree" | "degree-unit";
	unit?: TempUnit;
};

function Temperature({ value, display, unit }: TemperatureProps) {
	switch (display) {
		case "value":
			return <span>{value ?? 0}</span>;
		case "value-degree":
			return (
				<span>
					{value ?? 0}
					<span className="degree"></span>
				</span>
			);
		case "degree-unit":
			return (
				<span>
					<span className="degree"></span>
					{unit ?? "C"}
				</span>
			);
	}
}

export default Temperature;
