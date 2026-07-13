# Web Weather App by CocoX

This project was originally started from a brief given by SecuritEase; the brief can be found in the docs folder at [brief](docs/brief.md).
The content of the deliverable and what's "left" out is based on this brief and the amount of time that remains.

A weather app built for as part of a technical assessment.
It shows current conditions, a 3-day forecast, and 3-day history for a specified location, with day tiles that update the main display on click.

The goal of this application is to be written within a week, while still working on normal day-to-day developer tasks.
Items might be cut from the original deliverable, which is due EoD, July 15, 2026.

> This project may extend beyond this deadline, for a showcase on my personal projects which can be viewed at [newt.fyi/projects](https://newt.fyi/projects).

## Setup

1. Clone the repo and run `pnpm i` (or `npm install`, but `pnpm` is the recommended package manager).
2. Copy `.env.example` to `.env` and add your WeatherAPI.com key:
3. `pnpm dev` starts the app at `http://localhost:2121`.
4. `pnpm build` produces a production build in `dist/`.
5. `pnpm test` runs the test suite.

Get a free key at [weatherapi.com](https://www.weatherapi.com/signup.aspx).

## Why WeatherAPI.com instead of WeatherStack

The brief names WeatherStack's free tier as the data source,
and asks for a 3-day forecast plus 3-day history alongside current conditions.
Those two requirements do not fit on WeatherStack's free plan.

WeatherStack's Free plan gives real-time weather only, capped at 100 calls a month.
Forecast data sits behind the Professional plan at \$49.99 a month.
Historical data sits behind the Standard plan at \$9.99 a month.
(Source: [WeatherStack Pricing](https://weatherstack.com/pricing), checked July 2026)

Rather than pay for a plan or stitch together two providers for one app,
I moved current weather, forecast, and history onto WeatherAPI.com.
Its Free plan allows 100,000 calls a month, a 3-day forecast, 1 day of historical data,
and permits commercial use. (Source: [WeatherAPI Pricing](https://www.weatherapi.com/pricing.aspx))
That's 1,000 times WeatherStack's free call allowance, from a single response shape instead of two.

## Covering the extra 2 days of history

> ⚠️ UPDATE
> After exploring the API a little, I see that the WeatherAPI.com allows you to get history for any day
> The pricing page was a little confusing/misleading with this; and I'm still not exactly sure what they meant by only getting a single day's history.
> It's possible that you can only get a single day of history at a time - which is likely what that item on the pricing page means.
> But, because we are able to get history for a day, but just calling the api for that specific day, we'll always have all 3 days showing correctly from the start.
> The thing that doesn't change, is that we will continue to cache history weather, since it's in the past, it can't change.

~~WeatherAPI.com's free plan returns 1 day of history.
The brief asks for 3, and paying for WeatherStack's Standard plan or a second API just to cover 2 extra days didn't seem feasible.
Instead, the app builds its own trailing history:~~

~~- Every time the app loads, it writes that day's current-weather reading to `IndexedDB`~~
   ~~- Scope still needs defining on how this is stored~~
~~- Day -1 always comes from WeatherAPI.com's `history.json` endpoint, so it's accurate from the first run.~~
~~- Day -2 and day -3 come from the local cache, once the app has been opened on those days.~~
~~- On a first run, or after clearing site data, day -2 and day -3 show an explicit "no data yet" state rather than a blank tile or an invented number.~~
   ~~- This is a tradeoff, to prevent incurring costs on this project~~

## Mock data for development

100,000 calls a month is generous, but restarting the dev server or refreshing the browser 
while working on the UI adds up fast.
For this reason, the app uses `mock-weather-data.json`
(in the project root) which emulates the WeatherAPI.com's own response shape:
`location`, `current`, `forecast.forecastday[]`.

> ⚠️ 
> The JSON file will contain history information in a structure that is defined once the app has been built and contains history information that is pulled from browser storage. 

Set `VITE_USE_MOCK_DATA=true` in `.env` to load the fixture instead of calling the live API.

Because the fixture matches the real response shape field for field,
it also doubles as the schema for a possible future "load your own weather JSON" feature,
letting someone see the app rendered with their own numbers instead of a live location.
This is part of a stretch goal.

## Design decisions and trade-offs

As implementation is done, this will be populated with more items

- WeatherStack was swapped for WeatherAPI.com for the pricing reasons above.

### Items cut for time

In order to ensure that we get all the core functionality in place, some items may be cut from the scope for time. These items will be listed here for easy visibilty, and to mark future improvements that may be introduced later (even after the assessment is submitted).

- Item 1
- Item 2

## Testing

Test runner and what's covered, will be provided in this section

## Attribution

### WeatherAPI

WeatherAPI.com asks free-plan users to link back to their service. This information can be found on their [docs](https://www.weatherapi.com/docs/)

Approaches listed by them are provided here for quick reference:

```html
Powered by <a href="https://www.weatherapi.com/" title="Free Weather API">WeatherAPI.com</a>
```

or

```html
<a href="https://www.weatherapi.com/" title="Free Weather API"><img src='//cdn.weatherapi.com/v4/images/weatherapi_logo.png' alt="Weather data by WeatherAPI.com" border="0"></a>
```
