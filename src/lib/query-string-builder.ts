export class QueryStringBuilder {
	private query: Map<string, string>;

	constructor() {
		this.query = new Map<string, string>();
	}

	addQueryString(key: string, value: string): void {
		this.query.set(key, value);
	}

	build(): string {
		const mapArray = Array.from(this.query.entries());
		return mapArray.map(([key, value]) => `${key}=${value}`).join("&");
	}
}
