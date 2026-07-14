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
