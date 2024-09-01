const { SlashCommandBuilder } = require('@discordjs/builders');
const { ActionRowBuilder, ButtonBuilder, EmbedBuilder, ButtonStyle, ComponentType, PermissionsBitField } = require('discord.js');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('reinvites')
        .setDescription('Sends a reinvites embed with a button to get the session link.')
        .setDefaultMemberPermissions(PermissionsBitField.Flags.MuteMembers)
        .addStringOption(option =>
            option.setName('session-link')
                .setDescription('Session Link')
                .setRequired(true)),
    async execute(interaction) {
        try {
            const sessionLink = interaction.options.getString('session-link');
            const user = interaction.user;

            // Define the embed
            const embed = new EmbedBuilder()
                .setTitle('Mythville | Reinvites')
                .setDescription(`${user} has posted reinvites. Click on the button below to get the link. Don't forget to view the session information in the embed above.
                    
                    > If you have any issue's in the roleplay or discord server. You can always open a ticket.`);

            // Create the button
            const button = new ButtonBuilder()
                .setCustomId('get_link')
                .setLabel('Get Session Link')
                .setStyle(ButtonStyle.Primary);

            // Create the action row
            const row = new ActionRowBuilder()
                .addComponents(button);

            // Define the new embed for the log channel
            const newEmbed = new EmbedBuilder()
                .setTitle("Session Reinvites")
                .setDescription(`<@${interaction.user.id}> has released reinvites in <#1262427401648869427>. The link has been set to ${sessionLink}`);

            // Send the embed and button
            await interaction.channel.send({
                content: '@here',
                embeds: [embed],
                components: [row]
            });

            // Send the new embed to the log channel
            const logChannel = await interaction.client.channels.fetch('1279812069767643361');
            await logChannel.send({ embeds: [newEmbed] });

            await interaction.reply({ content: 'You have successfully sent the reinvites.', ephemeral: true });

            // Handle button interaction
            const filter = i => i.customId === 'get_link';
            const collector = interaction.channel.createMessageComponentCollector({ filter, componentType: ComponentType.Button, time: 9999999 });

            collector.on('collect', async i => {
                try {
                    await i.deferUpdate();

                    await i.followUp({ content: `**Link:** ${sessionLink}`, ephemeral: true });

                    const logEmbed = new EmbedBuilder()
                        .setTitle('Session Link Button')
                        .setDescription(`Button clicked by <@${i.user.id}>. Session link revealed in <#1262427401648869427>`);

                    await logChannel.send({ embeds: [logEmbed] });
                } catch (error) {
                    console.error('Error responding to interaction:', error);
                }
            });

            collector.on('end', collected => {
                console.log(`Collected ${collected.size} interactions.`);
            });
        } catch (error) {
            console.error('Error executing command:', error);
            await interaction.reply({ content: 'There was an error while executing this command.', ephemeral: true });
        }
    },
};
