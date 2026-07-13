export class QueryStringBuilder {
	private queryString: string;

	constructor() {
		this.queryString = "";
	}

	addQueryString(key: string, value: string): void {
		if (this.queryString !== "") {
			this.queryString += "&";
		}
		this.queryString += `${key}=${encodeURIComponent(value)}`;
	}

	build(): string {
		return `${this.queryString}`;
	}
}
