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

// import { Markup } from "telegraf";

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
 * command: /start
 * =====================
 * Send welcome message
 *
 */
const start = async (): Promise<void> => {
	bot.start((ctx) => {
		databases.writeSurvey({
			id: ctx.from.id,
			username: ctx.from.username,
			// survey_data: response,
		});
		ctx.reply(QUESTIONS[0]);
		console.log(ctx.from);
		createSurvey();
	});
};
const QUESTIONS = [
	"What is your name?",
	"What is your age?",
	"What is your favorite color?",
	"What is your favorite food?",
	"What is your hobby?",
];

/**
 * command: /survey
 * =====================
 * Create a simple survey
 *
 */
const createSurvey = async (): Promise<void> => {
	bot.command("survey", (ctx) => {
		databases.writeSurvey({
			id: ctx.from.id,
			username: ctx.from.username,
			// survey_data: response,
		});
		ctx.reply(QUESTIONS[0]);
		console.log(ctx.from);
	});

	bot.on("text", async (ctx) => {
		const survay = await databases.readSurvey(ctx.from.username!);

		console.log(survay);
		ctx.telegram.sendMessage(ctx.message.chat.id, `Your text --> ${ctx.update.message.text}`);
	});
	// Handle survey responses
	bot.action(/^survey_/, (ctx) => {
		// const response = ctx.match[0].split("_")[1];
		// ctx.answerCbQuery(`Thanks for your feedback: ${response}`);
		// // output response to console
		// console.log(response);
		// Here you can add code to store the survey response
		databases.writeSurvey({
			id: 1,
			survey_id: ctx.update.callback_query.from.id.toString(),
			// survey_data: response,
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

export { launch, quit, start, createSurvey };
export default launch;
