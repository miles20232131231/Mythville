const { SlashCommandBuilder } = require('discord.js');

module.exports = {
	data: new SlashCommandBuilder()
		.setName('ping')
		.setDescription('Replies with Pong! and shows the latency in milliseconds.'),
	async execute(interaction) {
		const start = Date.now();
		await interaction.reply('Pong! Calculating latency...');
		const latency = Date.now() - start;

		await interaction.editReply(`Pong! ${latency}ms`);
	},
};
