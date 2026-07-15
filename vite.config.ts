/// <reference types="vitest/config" />
import babel from "@rolldown/plugin-babel";
import tailwindcss from "@tailwindcss/vite";
import react, { reactCompilerPreset } from "@vitejs/plugin-react";
import { defineConfig } from "vite";

// https://vite.dev/config/
export default defineConfig({
	plugins: [react(), babel({ presets: [reactCompilerPreset()] }), tailwindcss()],
	server: {
		port: 2121,
	},
	test: {
		environment: "jsdom",
		// Pin the timezone so time-dependent tests are deterministic
		// Several components format and compare hours in LOCAL time via Intl.DateTimeFormat.
		// Without a fixed TZ, "which cell is Now", depends on where the test runs.
		env: {
			TZ: "Africa/Johannesburg",
		},

		typecheck: {
			tsconfig: "./tsconfig.test.json",
		},
		globals: true,
		setupFiles: ["./src/test/setup.ts"],
		include: ["src/**/*.{test,spec}.{ts,tsx}"],

		// exclude css in testing - it doesn't speak to the core functionality, it's visual components
		css: false,
	},
});
