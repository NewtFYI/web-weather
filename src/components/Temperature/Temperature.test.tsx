import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { Temperature } from "./Temperature.tsx";

describe("Temperature", () => {
	describe("rounds temperature C value to a whole number", () => {
		it("rounds for C", () => {
			render(<Temperature value={{ c: 8.8, f: 45.2 }} unit="C" display="value" />);
			expect(screen.getByText("9")).toBeInTheDocument();
		});

		it("rounds for F", () => {
			render(<Temperature value={{ c: 89.8, f: 42.2 }} unit="F" display="value" />);
			expect(screen.getByText("42")).toBeInTheDocument();
		});
	});

	describe("shows the correct unit value", () => {
		it("shows Fahrenheit when unit is F", () => {
			render(<Temperature value={{ c: 17, f: 69 }} unit="F" display="value" />);

			expect(screen.getByText("69")).toBeInTheDocument();
			expect(screen.queryByText("17")).not.toBeInTheDocument();
		});

		it("shows Celsius when unit is C", () => {
			render(<Temperature value={{ c: 17, f: 69 }} unit="C" display="value" />);

			expect(screen.getByText("17")).toBeInTheDocument();
			expect(screen.queryByText("69")).not.toBeInTheDocument();
		});
	});

	it("falls back to 0 when no value is provided", () => {
		render(<Temperature unit="C" display="value" />);

		// verify no NaN displayed
		expect(screen.getByText("0")).toBeInTheDocument();
	});

	describe("renders the number for the value-degree display variant", () => {
		it("shows correct value for C", () => {
			render(<Temperature value={{ c: 18, f: 49 }} unit="C" display="value-degree" />);
			expect(screen.getByText("18")).toBeInTheDocument();
			expect(screen.queryByText("49")).not.toBeInTheDocument();
		});

		it("shows correct value for F", () => {
			render(<Temperature value={{ c: 42, f: 21 }} unit="F" display="value-degree" />);
			expect(screen.getByText("21")).toBeInTheDocument();
			expect(screen.queryByText("42")).not.toBeInTheDocument();
		});
	});

	describe("renders the temperature unit for the degree-unit display variant", () => {
		it("shows correct value for C", () => {
			render(<Temperature value={{ c: 18, f: 49 }} unit="C" display="degree-unit" />);
			expect(screen.getByText("C")).toBeInTheDocument();
			expect(screen.queryByText("F")).not.toBeInTheDocument();
		});

		it("shows correct value for F", () => {
			render(<Temperature value={{ c: 42, f: 21 }} unit="F" display="degree-unit" />);
			expect(screen.getByText("F")).toBeInTheDocument();
			expect(screen.queryByText("C")).not.toBeInTheDocument();
		});
	});
});
