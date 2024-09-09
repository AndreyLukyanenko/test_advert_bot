// Airtable adapter
import Airtable from "airtable";

export class AirtableAdapter {
	private base: Airtable.Base;
	private tableId: string;

	constructor(apiKey: string, baseId: string, tableId: string) {
		this.base = new Airtable({ apiKey }).base(baseId);
		this.tableId = tableId;
	}

	async read(username: string) {
		try {
			const record = await this.base(this.tableId).find(username);
			return record;
		} catch (error) {
			console.error("Error reading from Airtable:", error);
			throw error;
		}
	}

	async write(data: any) {
		try {
			await this.base(this.tableId).create([{ fields: data }]);
		} catch (error) {
			console.error("Error details:", error);
			throw error;
		}
	}
}
