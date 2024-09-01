const { Events, PermissionsBitField, EmbedBuilder, ActionRowBuilder, ButtonBuilder, ButtonStyle, ChannelType, AttachmentBuilder } = require('discord.js');
const fs = require('fs');
const path = require('path');

const transcriptDir = './transcripts';
if (!fs.existsSync(transcriptDir)) {
    fs.mkdirSync(transcriptDir, { recursive: true });
}

module.exports = {
    name: Events.InteractionCreate,
    async execute(interaction) {
        const logChannelId = '1279812069767643361'; // Log channel ID
        const transcriptChannelId = '1279812069767643361'; // Channel to send the transcript
        const logChannel = interaction.guild.channels.cache.get(logChannelId);
        const transcriptChannel = interaction.guild.channels.cache.get(transcriptChannelId);

        try {
            // Handle String Select Menus
            if (interaction.isStringSelectMenu()) {
                if (interaction.customId === 'ticket_select') {
                    await interaction.deferReply({ ephemeral: true });
                    const selectedOption = interaction.values[0];
                    let ticketChannel;
                    let ticketDescription = '';

                    const generalStaffRoleId = '1262172643885318296'; 
                    const staffReportRoleId = '1273693063897677916'; 

                    const generalStaffRole = interaction.guild.roles.cache.get(generalStaffRoleId);
                    const staffReportRole = interaction.guild.roles.cache.get(staffReportRoleId);

                    if (!generalStaffRole || !staffReportRole) {
                        throw new Error(`One of the roles with IDs ${generalStaffRoleId} or ${staffReportRoleId} not found`);
                    }

                    const categoryID = '1273481928548552776'; 
                    const openTime = Math.floor(Date.now() / 1000);

                    ticketChannel = await interaction.guild.channels.create({
                        name: `${selectedOption}-${interaction.user.username}`,
                        type: ChannelType.GuildText,
                        parent: categoryID,
                        topic: `Created by: ${interaction.user.id} | Opened at: ${openTime}`,
                        permissionOverwrites: [
                            {
                                id: interaction.guild.id,
                                deny: [PermissionsBitField.Flags.ViewChannel],
                            },
                            {
                                id: interaction.user.id,
                                allow: [PermissionsBitField.Flags.ViewChannel, PermissionsBitField.Flags.SendMessages],
                            },
                            {
                                id: selectedOption === 'staff_report' ? staffReportRole.id : generalStaffRole.id,
                                allow: [PermissionsBitField.Flags.ViewChannel, PermissionsBitField.Flags.SendMessages],
                            },
                        ],
                    });

                    ticketDescription = `Thank you for submitting a ${selectedOption.replace('_', ' ')} ticket. Our staff team will reach back to you shortly.`;

                    const ticketEmbed = new EmbedBuilder()
                        .setTitle('Mythville | Server Support')
                        .setDescription(ticketDescription)
                        .setColor('#89cff0');

                    const claimButton = new ButtonBuilder()
                        .setCustomId('claim_ticket')
                        .setLabel('🙋‍♂️ Claim Ticket')
                        .setStyle(ButtonStyle.Primary);

                    const closeButton = new ButtonBuilder()
                        .setCustomId('close_ticket')
                        .setLabel('🔒 Close Ticket')
                        .setStyle(ButtonStyle.Danger);

                    const buttonRow = new ActionRowBuilder()
                        .addComponents(claimButton, closeButton);

                    await ticketChannel.send({ 
                        content: `${interaction.user}, <@&${selectedOption === 'staff_report' ? staffReportRoleId : generalStaffRoleId}>`, 
                        embeds: [ticketEmbed], 
                        components: [buttonRow] 
                    });

                    if (logChannel) {
                        const logEmbed = new EmbedBuilder()
                            .setTitle('Ticket Created')
                            .setDescription(`Ticket created by ${interaction.user} (${interaction.user.id})`)
                            .addFields(
                                { name: 'Ticket Type', value: selectedOption },
                                { name: 'Ticket Channel', value: ticketChannel ? ticketChannel.toString() : 'Unknown' },
                                { name: 'Open Time', value: `<t:${openTime}:f>` }
                            )
                            .setColor('#1D4DDE');
                        await logChannel.send({ embeds: [logEmbed] });
                    }

                    await interaction.editReply({ content: `Ticket created: ${ticketChannel}` });
                }
            }

            // Handle Button Interactions
            else if (interaction.isButton()) {
                const channelTopic = interaction.channel.topic || '';
                const openTimeStr = channelTopic.split(' | ')[1]?.split('Opened at: ')[1];
                const openTime = openTimeStr ? parseInt(openTimeStr) : Math.floor(Date.now() / 1000); 
                const closeTime = Math.floor(Date.now() / 1000);

                if (interaction.customId === 'claim_ticket') {
                    const staffRoleId = '1262172643885318296'; 
                    const staffReportRoleId = '1273693063897677916'; 

                    const roleToCheck = interaction.channel.name.startsWith('staff-report') ? staffReportRoleId : staffRoleId;

                    if (!interaction.member.roles.cache.has(roleToCheck)) {
                        if (!interaction.replied) {
                            await interaction.reply({ content: 'You do not have permission to claim this ticket.', ephemeral: true });
                        }
                        return;
                    }

                    const existingClaim = interaction.channel.permissionOverwrites.cache.find(perm => perm.id === interaction.user.id);
                    if (existingClaim) {
                        if (!interaction.replied) {
                            await interaction.reply({ content: 'This ticket has already been claimed.', ephemeral: true });
                        }
                        return;
                    }

                    await interaction.channel.permissionOverwrites.edit(interaction.user.id, { 
                        ViewChannel: true, 
                        SendMessages: true 
                    });

                    await interaction.channel.permissionOverwrites.edit(roleToCheck, { 
                        ViewChannel: false, 
                        SendMessages: false 
                    });

                    const claimButton = new ButtonBuilder()
                        .setCustomId('claim_ticket')
                        .setLabel('🙋‍♂️ Claim Ticket')
                        .setStyle(ButtonStyle.Primary)
                        .setDisabled(true);

                    const buttonRow = new ActionRowBuilder()
                        .addComponents(claimButton, interaction.message.components[0].components.find(button => button.customId === 'close_ticket'));
                    
                    await interaction.update({ components: [buttonRow] });

                    if (!interaction.replied) {
                        await interaction.reply({ content: `Ticket claimed by ${interaction.user}.`, ephemeral: false });
                    }

                    if (logChannel) {
                        const logEmbed = new EmbedBuilder()
                            .setTitle('Ticket Claimed')
                            .setDescription(`Ticket claimed by ${interaction.user} (${interaction.user.id})`)
                            .addFields(
                                { name: 'Ticket Channel', value: interaction.channel ? interaction.channel.toString() : 'Unknown' },
                                { name: 'Claim Time', value: `<t:${Math.floor(Date.now() / 1000)}:f>` }
                            )
                            .setColor('#1D4DDE');
                        await logChannel.send({ embeds: [logEmbed] });
                    }
                }

                if (interaction.customId === 'close_ticket') {
                    const ticketCloseEmbed = new EmbedBuilder()
                        .setTitle('Mythville | Ticket Closed')
                        .setDescription(`This ticket is now closed. The ticket creator will be notified once the ticket is permanently closed.`)
                        .addFields(
                            { name: 'Ticket Open time', value: `<t:${openTime}:f>` }, 
                            { name: 'Ticket Close time', value: `<t:${closeTime}:f>` }
                        )
                        .setColor('#1D4DDE');

                    const closeButton = new ButtonBuilder()
                        .setCustomId('close_ticket_final')
                        .setLabel('🔒 Final Close')
                        .setStyle(ButtonStyle.Danger);

                    const transcriptButton = new ButtonBuilder()
                        .setCustomId('transcript_ticket')
                        .setLabel('📝 Transcript')
                        .setStyle(ButtonStyle.Secondary);

                    const buttonRow = new ActionRowBuilder()
                        .addComponents(closeButton, transcriptButton);

                    await interaction.channel.send({ 
                        embeds: [ticketCloseEmbed], 
                        components: [buttonRow] 
                    });

                    if (!interaction.replied) {
                        await interaction.reply({ content: 'The ticket has been closed. It will be permanently closed once you click "Final Close".', ephemeral: true });
                    }

                    if (logChannel) {
                        const logEmbed = new EmbedBuilder()
                            .setTitle('Ticket Closed')
                            .setDescription(`Ticket closed by ${interaction.user} (${interaction.user.id})`)
                            .addFields(
                                { name: 'Ticket Channel', value: interaction.channel ? interaction.channel.toString() : 'Unknown' },
                                { name: 'Close Time', value: `<t:${Math.floor(Date.now() / 1000)}:f>` }
                            )
                            .setColor('#1D4DDE');
                        await logChannel.send({ embeds: [logEmbed] });
                    }
                }

                if (interaction.customId === 'close_ticket_final') {
                    await interaction.channel.send('Ticket is being permanently closed.');
                    const messages = await interaction.channel.messages.fetch({ limit: 100 });
                    const transcript = messages.map(m => `<div class="message"><div class="author">${m.author.tag}</div><div class="timestamp">(${m.createdAt.toLocaleString()})</div><div class="content">${m.content.replace(/\n/g, '<br>')}</div></div>`).join('\n');
                    const transcriptPath = path.join(transcriptDir, `${interaction.channel.name}_transcript.html`);

                    const htmlContent = `
                        <html>
                            <head>
                                <title>${interaction.channel.name} Transcript</title>
                                <style>
                                    body { font-family: Arial, sans-serif; }
                                    .message { border-bottom: 1px solid #ccc; padding: 10px 0; }
                                    .author { font-weight: bold; }
                                    .timestamp { color: #888; font-size: 0.9em; }
                                    .content { margin-top: 5px; }
                                </style>
                            </head>
                            <body>
                                <h1>${interaction.channel.name} Transcript</h1>
                                ${transcript}
                            </body>
                        </html>
                    `;
                    fs.writeFileSync(transcriptPath, htmlContent);

                    const attachment = new AttachmentBuilder(transcriptPath);

                    if (logChannel) {
                        const transcriptEmbed = new EmbedBuilder()
                            .setTitle('Ticket Transcript')
                            .setDescription(`Transcript for ticket ${interaction.channel.name}`)
                            .setColor('#1D4DDE');
                        await logChannel.send({ embeds: [transcriptEmbed], files: [attachment] });
                    }

                    if (transcriptChannel) {
                        const transcriptEmbed = new EmbedBuilder()
                            .setTitle('Ticket Transcript')
                            .setDescription(`Transcript for ticket ${interaction.channel.name}`)
                            .setColor('#1D4DDE');
                        await transcriptChannel.send({ embeds: [transcriptEmbed], files: [attachment] });
                    }

                    try {
                        await interaction.user.send({ 
                            content: 'Here is the transcript of your closed ticket.', 
                            files: [attachment] 
                        });
                    } catch (error) {
                        console.error('Could not send DM to user:', error);
                    }

                    await interaction.channel.delete();
                }

                if (interaction.customId === 'transcript_ticket') {
                    const messages = await interaction.channel.messages.fetch({ limit: 100 });
                    const transcript = messages.map(m => `<div class="message"><div class="author">${m.author.tag}</div><div class="timestamp">(${m.createdAt.toLocaleString()})</div><div class="content">${m.content.replace(/\n/g, '<br>')}</div></div>`).join('\n');
                    const transcriptPath = path.join(transcriptDir, `${interaction.channel.name}_transcript.html`);

                    const htmlContent = `
                        <html>
                            <head>
                                <title>${interaction.channel.name} Transcript</title>
                                <style>
                                    body { font-family: Arial, sans-serif; }
                                    .message { border-bottom: 1px solid #ccc; padding: 10px 0; }
                                    .author { font-weight: bold; }
                                    .timestamp { color: #888; font-size: 0.9em; }
                                    .content { margin-top: 5px; }
                                </style>
                            </head>
                            <body>
                                <h1>${interaction.channel.name} Transcript</h1>
                                ${transcript}
                            </body>
                        </html>
                    `;
                    fs.writeFileSync(transcriptPath, htmlContent);

                    const attachment = new AttachmentBuilder(transcriptPath);

                    if (!interaction.replied) {
                        await interaction.reply({ content: 'Transcript generated.', ephemeral: true, files: [attachment] });
                    }
                }
            }
        } catch (error) {
            console.error('Error handling interaction:', error);
            if (!interaction.replied) {
                await interaction.reply({ content: 'There was an error while executing this interaction.', ephemeral: true });
            }
        }
    }
};
