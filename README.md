# CocoX Weather

## About
This is a web weather app which shows current conditions, a 3-day forecast, and 3-day history for a specified location, with day tiles that update the main display on click.

## Brief
This project was originally started as an assessment. If you'd like to see the details of the original assessment you can find them in the docs area @ [assessment](docs/assessment.md).

The goal of this app was to be written within a week, while still working on normal day-to-day developer tasks.

> Once I have built a BFF to secure the API key, this project will be available on my personal projects showcase which can be viewed at [newt.fyi/projects](https://newt.fyi/projects).

## Setup

1. Install node `24.18.0`; recommended with `fnm` (or it's relative, `nvm`).
   1. The `.nvmrc` file defines the version that is required.
2. Clone the repo and run `pnpm i` (or `npm install`, but `pnpm` is the recommended package manager).
3. Copy `.env.example` to `.env` and add your WeatherAPI.com key:
4. `pnpm run dev` starts the app at `http://localhost:2121`.
5. `pnpm build` produces a production build in `dist/`.
6. `pnpm run test` runs the test suite.
7. `pnpm run coverage` generates a coverage report for the tests.
8. `pnpm run preview` serves a production build locally. 
9. Get a free key at [weatherapi.com](https://www.weatherapi.com/signup.aspx).

## Deliverable

The full deliverable information of the assessment can be found in [deliverable.md](docs/deliverable.md).
Check out this document for the rest of the documentation around design decisions, things that were cut, and future plans.

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

## Learnings

Some interesting learnings that I've gotten from this project

### Date Time Locale

`en-CA` - this date time locale is the dream that I've always had.
Ever since first year university, when our professor said "this is the correct way to view a date"; which was "YYYY-MM-DD", simply because, as he reasoned so well
"When you talk about time, you talk about hours, minutes and seconds. Going from large to big"; so likewise, dates should be the same. The `-` between the date parts has always just been my favourite.
Throughout the implementation here, I've learnt that `en-CA` has the closest predefined format that is basically what I've always wanted all my computers to be 🙈

Wanted to share this, because you'll see `en-CA` in the code, and this is the main reason why. Just so that I can flex that little muscle 💪