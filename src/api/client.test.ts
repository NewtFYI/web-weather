import { http, HttpResponse } from "msw";
import { setupServer } from "msw/node";
import { afterAll, afterEach, beforeAll, beforeEach, describe, expect, it, vi } from "vitest";

const API_BASE = "https://api.weatherapi.com/v1";

// One day, one hour. Enough for the mapper to produce a valid WeatherForecastData
function forecastPayload(date: string) {
	return {
		location: {
			name: "Durban",
			region: "KwaZulu-Natal",
			country: "South Africa",
			lat: -29.8,
			lon: 31,
			tz_id: "Africa/Johannesburg",
			localtime: `${date} 12:00`,
		},
		current: {
			last_updated_epoch: 1,
			last_updated: `${date} 12:00`,
			temp_c: 21,
			feelslike_c: 21,
			temp_f: 69,
			feelslike_f: 69,
			is_day: 1,
			condition: { text: "Sunny", code: 1000, icon: "//cdn/day.png" },
			chance_of_rain: 0,
			will_it_rain: 0,
			wind_kph: 5,
			humidity: 50,
		},
		forecast: {
			forecastday: [
				{
					date,
					date_epoch: 100,
					day: {
						maxtemp_c: 22,
						maxtemp_f: 72,
						mintemp_c: 15,
						mintemp_f: 59,
						avgtemp_c: 18,
						avgtemp_f: 64,
						maxwind_kph: 10,
						avghumidity: 60,
						daily_will_it_rain: 0,
						daily_chance_of_rain: 0,
						condition: { text: "Sunny", code: 1000, icon: "//cdn/day.png" },
					},
					astro: { sunrise: "07:00 AM", sunset: "05:30 PM" },
					hour: [
						{
							time: `${date} 12:00`,
							hour: 12,
							time_epoch: 120,
							temp_c: 21,
							feelslike_c: 21,
							temp_f: 69,
							feelslike_f: 69,
							is_day: 1,
							condition: { text: "Sunny", code: 1000, icon: "//cdn/day.png" },
							wind_kph: 5,
							will_it_rain: 0,
							chance_of_rain: 0,
						},
					],
				},
			],
		},
	};
}

// This is conceptually a history payload, but it's the same shape as the forecast object
function historyPayload(date: string, epoch: number) {
	const base = forecastPayload(date);
	base.forecast.forecastday[0].date_epoch = epoch;
	return { location: base.location, forecast: base.forecast };
}

const server = setupServer();

beforeAll(() => {
	// listen to intercept all network
	// `onUnhandledRequest: "error"` fails a test if the client calls a URL we did not stub, which catches endpoint typos
	server.listen({ onUnhandledRequest: "error" });
});
afterEach(() => server.resetHandlers());
afterAll(() => server.close());

beforeEach(() => {
	// Force the client onto the real HTTP path (not the mock JSON path) and give it a key.
	vi.stubEnv("VITE_USE_MOCK_DATA", "false");
	vi.stubEnv("VITE_WEATHER_API_KEY", "test-key");
	vi.resetModules();
});

afterEach(() => {
	vi.unstubAllEnvs();
});

describe("loadForecast", () => {
	/**
	 * The location search string is passed through as the `q` query param.
	 * The key from env is attached.
	 * The response is mapped into your domain shape.
	 * The client fans out history calls.
	 */
	it("requests the forecast endpoint with the location and returns mapped data", async () => {
		let seenUrl = "";
		server.use(
			http.get(`${API_BASE}/forecast.json`, ({ request }) => {
				seenUrl = request.url;
				return HttpResponse.json(forecastPayload("2026-07-15"));
			}),
			http.get(`${API_BASE}/history.json`, ({ request }) => {
				const dt = new URL(request.url).searchParams.get("dt") ?? "2026-07-12";
				return HttpResponse.json(historyPayload(dt, 90));
			}),
		);

		// Dynamic import AFTER env is stubbed, this was module `useMock` flag reads "false".
		const { loadForecast } = await import("../api/client.ts");
		const result = await loadForecast({ locationSearch: "Durban" });

		expect(seenUrl).toContain("q=Durban");
		expect(seenUrl).toContain("key=test-key");
		expect(result.location.name).toBe("Durban");
		expect(result.current.temp).toEqual({ c: 21, f: 69 });
	});

	/**
	 * The week rail expects past + present in a single sorted array.
	 * As part of the mock forecast day, the epoch is 100 and each history day has a smaller epoch, so history must end up first after the sort.
	 */
	it("merges history days with the forecast into one chronological list", async () => {
		server.use(
			http.get(`${API_BASE}/forecast.json`, () => HttpResponse.json(forecastPayload("2026-07-15"))),
			http.get(`${API_BASE}/history.json`, ({ request }) => {
				const dt = new URL(request.url).searchParams.get("dt") ?? "2026-07-12";
				const epoch = dt === "2026-07-12" ? 10 : dt === "2026-07-13" ? 20 : 30;
				return HttpResponse.json(historyPayload(dt, epoch));
			}),
		);

		const { loadForecast } = await import("../api/client.ts");
		const result = await loadForecast({ locationSearch: "Durban" });

		// 3 history days + 1 forecast day = 4
		expect(result.days).toHaveLength(4);
		const epochs = result.days.map((d) => d.epoch);
		// ensure asc order
		expect(epochs).toEqual([...epochs].sort((a, b) => a - b));
		// forecast day is last
		expect(result.days.at(-1)?.epoch).toBe(100);
	});

	/**
	 * The client uses Promise.allSettled for history so that a one failed history call does not sink the page.
	 * We make one history date (500) response and expect a shorter but valid result.
	 */
	it("still returns the forecast when a history day fails", async () => {
		server.use(
			http.get(`${API_BASE}/forecast.json`, () => HttpResponse.json(forecastPayload("2026-07-15"))),
			http.get(`${API_BASE}/history.json`, ({ request }) => {
				const dt = new URL(request.url).searchParams.get("dt");
				if (dt === "2026-07-12") return new HttpResponse(null, { status: 500 });
				return HttpResponse.json(historyPayload(dt ?? "2026-07-13", 20));
			}),
		);

		const { loadForecast } = await import("../api/client.ts");
		const result = await loadForecast({ locationSearch: "Durban" });

		// One history day dropped: 2 history + 1 forecast = 3
		expect(result.days).toHaveLength(3);
	});

	it("throws 'Unauthorized' on a 401 from the forecast endpoint", async () => {
		server.use(http.get(`${API_BASE}/forecast.json`, () => new HttpResponse(null, { status: 401 })));

		const { loadForecast } = await import("../api/client.ts");

		await expect(loadForecast({ locationSearch: "Durban" })).rejects.toThrow("Unauthorized");
	});

	it("throws 'API Request Failed' on other non-ok responses", async () => {
		server.use(http.get(`${API_BASE}/forecast.json`, () => new HttpResponse(null, { status: 500 })));

		const { loadForecast } = await import("../api/client.ts");

		await expect(loadForecast({ locationSearch: "Durban" })).rejects.toThrow("API Request Failed");
	});
});

describe("searchCity", () => {
	it("maps API city results into the trimmed WeatherCity shape", async () => {
		server.use(
			http.get(`${API_BASE}/search.json`, ({ request }) => {
				expect(new URL(request.url).searchParams.get("q")).toBe("port");
				return HttpResponse.json([
					{ id: 1, name: "Port Shepstone", region: "KwaZulu-Natal", country: "South Africa", lat: -30.7, lon: 30.4, url: "port-shepstone" },
				]);
			}),
		);

		const { searchCity } = await import("../api/client.ts");
		const cities = await searchCity({ locationSearch: "port" });

		// Assert mapCity on the exact resulting shape.
		expect(cities).toEqual([{ name: "Port Shepstone", region: "KwaZulu-Natal", country: "South Africa", url: "port-shepstone" }]);
	});
});
