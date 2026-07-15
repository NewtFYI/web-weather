/**
 * This is to help map the icons from WeatherAPI to lucide-icons,
 * so that the icons can have their SVGs controlled via the app.
 * The icons given by WeatherAPI are png's so we want to have our own custom one's,
 * so that the typography can align with the overall design decision
 *
 * Claude.ai helped in getting the codes mapping to the icons
 */

import { Cloud, CloudDrizzle, CloudFog, CloudLightning, CloudMoon, CloudRain, CloudSun, type LucideIcon, Moon, Sun, } from "lucide-react";

const THUNDER = [1087, 1273, 1276, 1279, 1282];
const RAIN = [
	1063, 1069, 1072, 1150, 1153, 1168, 1171, 1180, 1183, 1186, 1189, 1192, 1195, 1198, 1201, 1204, 1207, 1240, 1243, 1246, 1249, 1252, 1255,
	1258, 1261, 1264,
];
const DRIZZLE = [1063, 1069, 1072, 1150, 1153, 1168, 1171];
const FOG = [1030, 1135, 1147];
const CLOUDY = [1006, 1009, 1030, 1135, 1147];
const PARTLY = [1003];
const CLEAR = [1000];

export function mapConditionCodeToIcon(code: number, isDay?: boolean): LucideIcon {
	if (THUNDER.includes(code)) return CloudLightning;
	if (DRIZZLE.includes(code)) return CloudDrizzle;
	if (RAIN.includes(code)) return CloudRain;
	if (FOG.includes(code)) return CloudFog;
	if (CLOUDY.includes(code)) return Cloud;
	// cloudy and clear skies have moon icons from lucide; depending on the current time of day, we can display the "time" aware icon
	// because day is optional, we should only change icons if it is provided
	if (PARTLY.includes(code)) {
		if (isDay !== undefined) {
			return isDay ? CloudSun : CloudMoon;
		} else {
			return CloudSun;
		}
	}
	if (CLEAR.includes(code)) {
		if (isDay !== undefined) {
			return isDay ? Sun : Moon;
		} else {
			return Sun;
		}
	}
	return Cloud;
}
