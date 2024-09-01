const { Permissions, SlashCommandBuilder, EmbedBuilder, ActionRowBuilder, StringSelectMenuBuilder, ButtonBuilder, ButtonStyle, ChannelType, PermissionFlagsBits, PermissionsBitField } = require('discord.js');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('setup-ticket')
        .setDescription('Create a ticket')
        .setDefaultMemberPermissions(PermissionsBitField.Flags.Administrator),
    async execute(interaction) {

        await interaction.reply({ content: 'Setting up ticket system...', ephemeral: true });
        const embed = new EmbedBuilder()
            .setTitle('Mythville | Server Support')
            .setDescription(`Select the appropriate option from the dropdown menu to open your ticket, and be patient as our support team might be occupied. Submitting troll tickets will lead to a violation. After opening a ticket, you will receive further instructions.

                **__Before you open a ticket__**
                Please note opening troll tickets would result in a server mute and strike.
                Opening a ticket to ask for server assets would result in a warning and instant decline.`)

        const selectMenu = new StringSelectMenuBuilder()
            .setCustomId('ticket_select')
            .setPlaceholder('Select an option')
            .addOptions([
                {
                    label: 'Staff Report',
                    description: 'Report a staff member.',
                    value: 'staff_report',
                },
                {
                    label: 'Civilian Report',
                    description: 'Report a civilian.',
                    value: 'civ_report',
                },
                {
                    label: 'General Support',
                    description: 'Get general support.',
                    value: 'general_support',
                },
            ]);

        const row = new ActionRowBuilder()
            .addComponents(selectMenu);

        await interaction.channel.send({ embeds: [embed], components: [row]});

        await interaction.editReply({ content: 'Ticket system setup complete!', ephemeral: true });
    },
};
