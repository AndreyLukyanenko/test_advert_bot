/**
 * Database: lowdb
 * =====================
 *
 * @contributors: Patryk Rzucidło [@ptkdev] <support@ptkdev.io> (https://ptk.dev)
 *
 * @license: MIT License
 *
 */
import type { SurveyInterface } from "@app/types/databases.type";
import configs from "@configs/config";
// import lowdb from "lowdb";
// import lowdbFileSync from "lowdb/adapters/FileSync";
// import { GoogleSheetsAdapter } from "@app/adapters/googlesheetsadapter";
import { AirtableAdapter } from "@app/adapters/airtableadapter";

const databases = {
	// users: new GoogleSheetsAdapter(""),
	// read from config
	surveys: new AirtableAdapter(
		configs.databases.surveys.apiKey,
		configs.databases.surveys.baseId,
		configs.databases.surveys.tableId,
	),
};

/**
 * writeUser()
 * =====================
 * Write user information from telegram context to user database
 *
 * @Context: ctx.update.message.from
 *
 * @param data
 * @param username
 * @interface [TelegramUserInterface](https://github.com/ptkdev-boilerplate/node-telegram-bot-boilerplate/blob/main/app/webcomponent/types/databases.type.ts)
 *
 * @param { TelegramUserInterface } json - telegram user object
 *
 */
// const writeUser = async (json: TelegramUserInterface): Promise<void> => {
// 	// Implement logic to update or append user data in Google Sheets
// 	await databases.surveys.write(json);
// };

const readSurvey = async (username: string): Promise<void> => {
	try {
		await databases.surveys.read(username);
	} catch (error) {
		console.error("Error reading from Airtable:", error);
		throw error;
	}
};

const writeSurvey = async (data: SurveyInterface): Promise<void> => {
	try {
		await databases.surveys.write(data);
	} catch (error) {
		console.error("Error writing to Airtable:", error);
		throw error;
	}
};

export { databases, writeSurvey, readSurvey };
export default databases;
