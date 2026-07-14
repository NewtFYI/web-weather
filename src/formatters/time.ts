export function formatHour(time: string): string {
	const formatter = Intl.DateTimeFormat("en", {
		hourCycle: "h23",
		hour: "2-digit",
	});
	const date = new Date(time);
	const formatParts = formatter.formatToParts(date);
	const hourPart = formatParts.find((x) => x.type === "hour");
	if (!hourPart) {
		return "00h";
	} else {
		return `${hourPart.value}h`;
	}
}

/**
 * Get a date in format YYYY-MM-DD
 * The `en-CA` locale, automatically gives us YYYY-MM-DD, so no need for date parts
 */
export function toApiDate(date: Date, timeZone: string): string {
	//
	return new Intl.DateTimeFormat("en-CA", {
		timeZone,
		year: "numeric",
		month: "2-digit",
		day: "2-digit",
	}).format(date);
}

/**
 * The `count` calendar days immediately before `from`, oldest first.
 * `from` is a YYYY-MM-DD string, so this is pure string/date arithmetic with no timezone ambiguity.
 */
export function previousDates(from: string, count: number): string[] {
	const dates: string[] = [];
	for (let i = count; i >= 1; i--) {
		const d = new Date(`${from}T00:00:00Z`);
		d.setUTCDate(d.getUTCDate() - i);
		dates.push(d.toISOString().slice(0, 10));
	}
	return dates;
}
