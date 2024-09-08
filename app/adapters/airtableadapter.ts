// Airtable adapter
import Airtable from "airtable";

export class AirtableAdapter {
	private base: Airtable.Base;
	private tableId: string;

	constructor(apiKey: string, baseId: string, tableId: string) {
		this.base = new Airtable({ apiKey }).base(baseId);
		this.tableId = tableId;
	}

	async read() {
		// Implement reading from Airtable
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
