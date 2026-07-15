import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { makeDay } from "../../test/fixtures.ts";
import { WeekRail } from "./WeekRail.tsx";

// Three consecutive days as predicted from a forecast for the app;
// 2026-07-15 is a Wednesday, 16 Thursday, 17 Friday.
function makeWeek() {
	return [makeDay({ date: "2026-07-15" }), makeDay({ date: "2026-07-16" }), makeDay({ date: "2026-07-17" })];
}

/**
 * WeekRail is the "day data" core feature:
 *   - given an array of days
 *     - Render output given data (the tile and its temperatures)
 *     - Handle user interaction => callback, clicking a tile selects it
 */
describe("WeekRail", () => {
	beforeEach(() => {
		vi.useFakeTimers();
		vi.setSystemTime(new Date("2026-07-15T12:00:00+02:00"));
	});

	afterEach(() => {
		vi.useRealTimers();
	});

	it("renders one tile per day in a range of days", () => {
		render(<WeekRail days={makeWeek()} today="2026-07-15" selectedDate="2026-07-15" unit="C" onSelect={() => {}} />);

		expect(screen.getAllByRole("button")).toHaveLength(3);
	});

	it("marks the current day with a Today label and aria-current", () => {
		render(<WeekRail days={makeWeek()} today="2026-07-15" selectedDate="2026-07-15" unit="C" onSelect={() => {}} />);

		expect(screen.getByText("Today")).toBeInTheDocument();
		const todayTiles = screen.getAllByRole("button").filter((b) => b.getAttribute("aria-current") === "date");
		expect(todayTiles).toHaveLength(1);
	});

	it("reflects the selected day through aria-pressed", () => {
		render(<WeekRail days={makeWeek()} today="2026-07-15" selectedDate="2026-07-16" unit="C" onSelect={() => {}} />);

		const pressed = screen.getAllByRole("button").filter((b) => b.getAttribute("aria-pressed") === "true");
		expect(pressed).toHaveLength(1);
	});

	/**
	 * This test doesn't depend on "now", so we use the real timers;
	 * so that the selection can reflect the change
	 */
	it("calls onSelect with the day's date when a tile is clicked", async () => {
		vi.useRealTimers();

		const onSelect = vi.fn();
		const user = userEvent.setup();

		render(<WeekRail days={makeWeek()} today="2026-07-15" selectedDate="2026-07-15" unit="C" onSelect={onSelect} />);

		await user.click(screen.getAllByRole("button")[2]);

		expect(onSelect).toHaveBeenCalledTimes(1);
		expect(onSelect).toHaveBeenCalledWith("2026-07-17");
	});

	it("shows each day's average temperature in the selected unit", () => {
		render(<WeekRail days={makeWeek()} today="2026-07-15" selectedDate="2026-07-15" unit="C" onSelect={() => {}} />);

		// a value defined in our mock data for a day
		expect(screen.getAllByText("29").length).toBeGreaterThan(0);
	});
});
