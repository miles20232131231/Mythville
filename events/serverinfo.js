const { Events, EmbedBuilder, ActionRowBuilder, ButtonBuilder, ButtonStyle } = require('discord.js');
const fs = require('fs');

const transcriptDir = './transcripts';
if (!fs.existsSync(transcriptDir)) {
    fs.mkdirSync(transcriptDir, { recursive: true });
}

module.exports = {
    name: Events.InteractionCreate,
    async execute(interaction) {
        try {
            // Server Information Interaction
            if (interaction.isStringSelectMenu() && interaction.customId === 'information_select') {
                let embedResponses = [];
                let components = [];

                switch (interaction.values[0]) {
                    case 'sguild':
                        const comingSoonEmbed = new EmbedBuilder()
                            .setDescription(`**Roblox Compliance:** Always adhere to Roblox's Terms of Service.

**Yielding to Emergency Vehicles:** Move to the right or left to allow emergency vehicles to pass. During traffic stops, either switch lanes or slow down to avoid collisions.

**'Criminal' Team Participation:** You may only join the 'Criminal' team if you have priority and have received explicit permission from the session host.

**Prohibited Roleplays:** The following types of roleplay are strictly forbidden and may result in a ban: sexual content, gang-related scenarios, abuse, child neglect, school shootings, alcohol-related roleplay, suicidal themes, bombings, kidnappings, mass murder, or any other inappropriate content.

**Public Services Team Access:** You may not join any public services team unless you hold the necessary department roles on the Discord server.

**Scenario Voiding:** Only the session host has the authority to void a scenario. Civilians are not permitted to void scenarios. If needed, request a void from the session host.

**Reckless Driving:** Reckless driving behaviors, such as driving into oncoming traffic, off-roading, evading, failing to maintain a 5-vehicle distance when merging lanes, and running red lights, are prohibited.

**Avatar Realism:** Ensure your avatar is realistic before leaving the spawn area. Costumes and unrealistic items are not allowed.

**Vehicle Colors and Rims:** Vehicle colors and rims must be realistic. Neon colors (e.g., pink, yellow, green) are not allowed. Factory colors and rims are acceptable.

**Handling Lag or Device Issues:** If you experience lag or device issues, pull over until they are resolved.

**Horn Usage:** Do not abuse the horn. Honking for more than 3 seconds is considered horn abuse.

**Cruising and Convoys:** Cruising with friends in different vehicles is permitted, but convoys with three or more identical vehicles are not allowed in our sessions.

**Spawn/Dealership Area:** The spawn and dealership area is voided, but this should not be abused.

**Impersonation:** Impersonating staff or public service members is strictly prohibited.

**Camber Adjustments:** Adjusting the camber on your vehicles is not allowed unless you have the banned vehicle exemption, blacklisted vehicle exemption, or other relevant roles.

**Interfering with Scenes:** Do not interfere with scenes you are not involved in, whether in-game or in voice channels.

**Peacetime Guidelines**

- **Strict Peacetime:** When Strict Peacetime is active, the fail roleplay speed limit is 65 mph. Donuts, drifting, and minor crimes are prohibited, and any warnable offenses will result in double warnings.

- **Normal Peacetime:** During Normal Peacetime, the fail roleplay speed limit is 75 mph. You may engage in minor driving activities such as drifting, burnouts, and donuts, but crimes like assault or shoplifting are not allowed.

- **Peacetime Disabled:** With Peacetime Disabled, the fail roleplay speed limit increases to 85 mph. Minor crimes such as assault, drifting, vehicle launches, and evading law enforcement on foot are allowed. However, major offenses like running red lights, fail roleplay, assaulting Public Services Members, robbing stores, and evading LEOs in a vehicle (without priority) are still prohibited. All rules must be followed during priority scenarios.`)
                            .setColor(0xc45656);

                        if (!interaction.replied && !interaction.deferred) {
                            await interaction.reply({
                                embeds: [comingSoonEmbed],
                                ephemeral: true
                            });
                        }
                        return;

                        case 'ss':
                            // Server Links as an embed
                            const serverLinksEmbed = new EmbedBuilder()
                                .setTitle('Server Links')
                                .setDescription(`Roblox Group:https://www.roblox.com/groups/34844383/Mythville-Greenville-Roleplay#!/about

                                    Banned Vehicle List:https://docs.google.com/document/d/1rah5nJCpUvz6CdfNU24ePiV_xYMKsf6UsPPAfZH3yVI/edit`)
                                .setColor(0xc45656); // Change color as needed
    
                            if (!interaction.replied && !interaction.deferred) {
                                await interaction.reply({
                                    embeds: [serverLinksEmbed],
                                    ephemeral: true
                                });
                            }
                            return;
                    case 'ses':
                        const sessionPingEmbed = new EmbedBuilder()
                            .setTitle('Server Support')
                            .setDescription(`If you are looking for server support, you can always go to <#1279814272175706193>.`)
                            .setColor(0xc45656);

                        embedResponses.push(sessionPingEmbed);
                        break;
                }

                if (embedResponses.length > 0 && !interaction.replied && !interaction.deferred) {
                    await interaction.reply({
                        embeds: embedResponses,
                        components,
                        ephemeral: true
                    });
                }
            }
            // Server Ping Button Interaction
            else if (interaction.isButton() && interaction.customId === 'toggle_ping') {
                const roleId1 = '1259391092688818206';
                const member = interaction.member;

                if (member.roles.cache.has(roleId1)) {
                    await member.roles.remove(roleId1);
                    if (!interaction.replied && !interaction.deferred) {
                        await interaction.reply({
                            content: 'The <@&1259391092688818206> role has been removed from you.',
                            ephemeral: true
                        });
                    }
                } else {
                    await member.roles.add(roleId1);
                    if (!interaction.replied && !interaction.deferred) {
                        await interaction.reply({
                            content: 'You have been granted the <@&1259391092688818206> role.',
                            ephemeral: true
                        });
                    }
                }
            }
            // Ticketing System Interaction
            else if (interaction.isStringSelectMenu() && interaction.customId === 'ticket_select') {
                // Handle ticket creation
            } else if (interaction.isButton()) {
                // Handle ticket claiming, closing, reopening, etc.
            }
        } catch (error) {
            console.error(`Error handling interaction: ${error}`);
            if (!interaction.replied && !interaction.deferred) {
                try {
                    await interaction.reply({ content: 'An error occurred while handling your request.', ephemeral: true });
                } catch (replyError) {
                    console.error(`Failed to send error reply: ${replyError}`);
                }
            }
        }
    },
};
