const { SlashCommandBuilder, EmbedBuilder, ButtonBuilder, ActionRowBuilder, ButtonStyle, PermissionFlagsBits, PermissionsBitField } = require('discord.js');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('startup-message')
        .setDefaultMemberPermissions(PermissionsBitField.Flags.Administrator)
        .setDescription('Gives Startup msg'),
    async execute(interaction) {
        await interaction.deferReply({ ephemeral: true });

        const embed1 = new EmbedBuilder()
            .setTitle('Mythville | Sessions')
            .setDescription(`> - Welcome to sessions channel, the place where staff members host sessions in Mythville. Please refrain from asking staff members to host sessions. Before joining any sessions, make sure to read our ⁠guidelines and review our roleplay information.

> - If you have any reports or questions, head over to our ⁠support channel, and our team will assist you as soon as possible. Thank you for being a part of Mythville, and we hope you enjoy your experience here!`)
            .setColor(0xc45656);

        const button3 = new ButtonBuilder()
            .setLabel('Information')
            .setStyle(ButtonStyle.Link)
            .setURL('https://discord.com/channels/1232394318086541353/1232649682166222858');

        const row = new ActionRowBuilder()
            .addComponents(button3);

        await interaction.channel.send({ embeds: [embed1], components: [row] });

        await interaction.editReply({ content: 'Startup message sent.' });
    },
};
