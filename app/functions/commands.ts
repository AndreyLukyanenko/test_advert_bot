/**
 * Telegraf Commands
 * =====================
 *
 * @contributors: Patryk Rzucidło [@ptkdev] <support@ptkdev.io> (https://ptk.dev)
 *
 * @license: MIT License
 *
 */
import bot from "@app/functions/telegraf";
import * as databases from "@app/functions/databases";
import config from "@configs/config";
import { launchPolling, launchWebhook } from "./launcher";

const start = async (): Promise<void> => {
	bot.start((ctx) => {
		databases.writeSurvey({
			id: ctx.from.id,
			username: ctx.from.username,
			firstName: ctx.from.first_name,
			lastName: ctx.from.last_name ? ctx.from.last_name : "",
		});
		ctx.reply("Введіть ваше повне ім'я");
		console.log(ctx.from);
		createSurvey();
	});
};

const createSurvey = async (): Promise<void> => {
	bot.on("text", async (ctx) => {
		const surveyAnswers = await databases.readAllSurveys();
		console.log(surveyAnswers);
		const currentUserSurvey = surveyAnswers.filter(
			(survey: any) => survey.fields.username === ctx.from.username,
		)[0];
		if (!currentUserSurvey.fields.fullName) {
			await databases.updateSurvey({
				id: currentUserSurvey.id,
				fields: {
					...currentUserSurvey.fields,
					fullName: ctx.message.text,
				},
			});
			ctx.reply("Дякуємо! Тепер введіть ваш email");
		} else if (!currentUserSurvey.fields.email) {
			await databases.updateSurvey({
				id: currentUserSurvey.id,
				fields: {
					...currentUserSurvey.fields,
					email: ctx.message.text,
				},
			});
			ctx.reply("Дякуємо! Тепер введіть ваш телефонний номер");
		} else if (!currentUserSurvey.fields.phoneNumber) {
			await databases.updateSurvey({
				id: currentUserSurvey.id,
				fields: {
					...currentUserSurvey.fields,
					phoneNumber: ctx.message.text,
				},
			});
			ctx.reply("Дякуємо! Ми скоро з Вами зв'яжемося");
		}
	});
};

const quit = async (): Promise<void> => {
	bot.command("quit", (ctx) => {
		ctx.telegram.leaveChat(ctx.message.chat.id);
		ctx.leaveChat();
	});
};

const launch = async (): Promise<void> => {
	const mode = config.mode;
	if (mode === "webhook") {
		launchWebhook();
	} else {
		launchPolling();
	}
	await createSurvey();
};

export { launch, quit, start, createSurvey };
export default launch;
