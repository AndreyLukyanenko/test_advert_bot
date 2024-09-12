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

	async readAll() {
		return new Promise((resolve, reject) => {
			const result: any[] = [];
			this.base(this.tableId)
				.select({
					// Selecting the first 3 records in Grid view:
					maxRecords: 10,
					fields: ["id", "username", "firstName", "lastName", "fullName", "email", "phoneNumber"],
					view: "Grid view",
				})
				.eachPage(
					function page(records, fetchNextPage) {
						// This function (`page`) will get called for each page of records.

						records.forEach(function (record) {
							console.log("Retrieved", record.get("id"));
							result.push({
								id: record.id,
								fields: {
									id: record.get("id"),
									username: record.get("username"),
									firstName: record.get("firstName"),
									lastName: record.get("lastName"),
									fullName: record.get("fullName"),
									email: record.get("email"),
									phoneNumber: record.get("phoneNumber"),
								},
							});
						});

						// To fetch the next page of records, call `fetchNextPage`.
						// there are more records, `page` will get called again.
						// If there are no more records, `done` will get called.
						fetchNextPage();
					},
					function done(err) {
						if (err) {
							reject(err);
						}
						resolve(result);
					},
				);
		});
	}

	async write(data: any) {
		try {
			await this.base(this.tableId).create([{ fields: data }]);
		} catch (error) {
			console.error("Error details:", error);
			throw error;
		}
	}

	async update(data: any) {
		try {
			await this.base(this.tableId).update([data]);
		} catch (error) {
			console.error("Error details:", error);
			throw error;
		}
	}
}
