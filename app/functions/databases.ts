/**
 * Database: lowdb
 * =====================
 *
 * @contributors: Patryk Rzucidło [@ptkdev] <support@ptkdev.io> (https://ptk.dev)
 *
 * @license: MIT License
 *
 */
import type { TelegramUserInterface, SurveyInterface } from "@app/types/databases.type";
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
 * @interface [TelegramUserInterface](https://github.com/ptkdev-boilerplate/node-telegram-bot-boilerplate/blob/main/app/webcomponent/types/databases.type.ts)
 *
 * @param { TelegramUserInterface } json - telegram user object
 *
 */
// const writeUser = async (json: TelegramUserInterface): Promise<void> => {
// 	// Implement logic to update or append user data in Google Sheets
// 	await databases.surveys.write(json);
// };

const writeSurvey = async (json: SurveyInterface): Promise<void> => {
	// Implement logic to update or append user data in Google Sheets
	await databases.surveys.write(json);
};

export { databases, writeSurvey };
export default databases;
