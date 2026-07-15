import { render, screen } from "@testing-library/react";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { makeDay } from "../../test/fixtures.ts";
import { HourlyRail } from "./HourlyRail.tsx";

/**
 * HourlyRail is the "hour data" core feature:
 *   - given a day
 *     - render one cell per hour, each showing the hour label
 *     - render the hour's temperature
 *     - highlight current hour as "Now"
 */
describe("HourlyRail", () => {
	beforeEach(() => {
		vi.useFakeTimers();
		vi.setSystemTime(new Date("2026-07-15T12:00:00+02:00"));
	});

	afterEach(() => {
		// Rest to normal clock so that other tests can use it as needed
		vi.useRealTimers();
	});

	it("renders a cell for every hour in the day", () => {
		render(<HourlyRail day={makeDay()} unit="C" isToday={true} />);

		// The 12:00 cell is the current hour, so it shows "Now" rather than "12h".
		expect(screen.getByText("Now")).toBeInTheDocument();

		Array.from({ length: 24 }, (_, i) => i)
			.filter((hour) => hour !== 12)
			.forEach((hour) => {
				expect(screen.getByText(`${hour.toString().padStart(2, "0")}h`)).toBeInTheDocument();
			});
	});

	it("marks the hour matching the frozen clock as 'Now'", () => {
		render(<HourlyRail day={makeDay()} unit="C" isToday={true} />);

		expect(screen.getByText("Now")).toBeInTheDocument();
		expect(screen.queryByText("12h")).not.toBeInTheDocument();
	});

	it("does not label any cell 'Now' when the day is not today", () => {
		render(<HourlyRail day={makeDay({ date: "2026-07-17" })} unit="C" isToday={false} />);

		expect(screen.queryByText("Now")).not.toBeInTheDocument();
		Array.from({ length: 24 }, (_, i) => i).forEach((hour) => {
			expect(screen.getByText(`${hour.toString().padStart(2, "0")}h`)).toBeInTheDocument();
		});
	});

	it("shows each hour's temperature in the selected unit", () => {
		render(<HourlyRail day={makeDay()} unit="F" isToday={true} />);

		expect(screen.getByText("66")).toBeInTheDocument();
	});
});
