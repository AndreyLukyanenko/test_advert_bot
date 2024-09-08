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
import { Markup } from "telegraf";

/**
 * command: /quit
 * =====================
 * If user exit from bot
 *
 */
const quit = async (): Promise<void> => {
	bot.command("quit", (ctx) => {
		ctx.telegram.leaveChat(ctx.message.chat.id);
		ctx.leaveChat();
	});
};

/**
 * command: /photo
 * =====================
 * Send photo from picsum to chat
 *
 */
const sendPhoto = async (): Promise<void> => {
	bot.command("photo", (ctx) => {
		ctx.replyWithPhoto("https://picsum.photos/200/300/");
	});
};

/**
 * command: /start
 * =====================
 * Send welcome message
 *
 */
const start = async (): Promise<void> => {
	bot.start((ctx) => {
		ctx.telegram.sendMessage(ctx.message.chat.id, `Welcome! Try send /survey command or write any text`);
	});
};

/**
 * command: /survey
 * =====================
 * Create a simple survey
 *
 */
const createSurvey = async (): Promise<void> => {
	bot.command("survey", (ctx) => {
		ctx.reply(
			"How do you like our bot?",
			Markup.inlineKeyboard([
				[Markup.button.callback("👍 Great", "survey_great")],
				[Markup.button.callback("😐 Okay", "survey_okay")],
				[Markup.button.callback("👎 Not good", "survey_not_good")],
			]),
		);
	});

	// Handle survey responses
	bot.action(/^survey_/, (ctx) => {
		const response = ctx.match[0].split("_")[1];
		ctx.answerCbQuery(`Thanks for your feedback: ${response}`);
		// output response to console
		console.log(response);
		// Here you can add code to store the survey response
		databases.writeSurvey({
			id: 1,
			survey_id: ctx.update.callback_query.from.id.toString(),
			survey_data: response,
		});
	});
};

/**
 * Run bot
 * =====================
 * Send welcome message
 *
 */
const launch = async (): Promise<void> => {
	const mode = config.mode;
	if (mode === "webhook") {
		launchWebhook();
	} else {
		launchPolling();
	}
	await createSurvey();
};

export { launch, quit, sendPhoto, start, createSurvey };
export default launch;
