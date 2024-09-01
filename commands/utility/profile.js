const { SlashCommandBuilder, EmbedBuilder, ButtonBuilder, ActionRowBuilder, ButtonStyle, PermissionsBitField } = require('discord.js');
const path = require('path');
const fs = require('fs');


const dataFolderPath = path.join(__dirname, '../../data/vehicleData');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('profile')
        .setDescription('Displays your or another user\'s profile.')
        .addUserOption(option =>
            option.setName('user')
                .setDescription('Select a user to view their profile. If not selected, shows your profile.')),

    async execute(interaction) {
        const selectedUser = interaction.options.getUser('user') || interaction.user;
        const userId = selectedUser.id;
        const userTag = selectedUser.tag;

        
        const userFilePath = path.join(dataFolderPath, `${userId}.json`);

        try {
           
            let userVehicles = [];
            if (fs.existsSync(userFilePath)) {
                userVehicles = JSON.parse(fs.readFileSync(userFilePath, 'utf8'));
            }

            const embed = new EmbedBuilder()
                .setTitle(`${userTag}'s Profile`)
                .setDescription(`User: ${userTag}\nRegistered Vehicles: ${userVehicles.length}`)
                .setColor(0x2B2D31)
                .setThumbnail(selectedUser.displayAvatarURL());

            const viewButton = new ButtonBuilder()
                .setCustomId(`view_vehicles_${userId}`)
                .setLabel('View Vehicles')
                .setStyle(ButtonStyle.Secondary);

            const row = new ActionRowBuilder()
                .addComponents(viewButton);

            
            const profileMessage = await interaction.reply({ embeds: [embed], components: [row], fetchReply: true });

            
            const filter = i => i.customId.startsWith('view_vehicles_') && i.user.id === interaction.user.id;
            const collector = interaction.channel.createMessageComponentCollector({ filter, time: 60000 }); // Extended time

            collector.on('collect', async i => {
                const userId = i.customId.split('_')[2]; 
                if (i.customId === `view_vehicles_${userId}`) {
                    const userVehiclesFilePath = path.join(dataFolderPath, `${userId}.json`);
                    let userVehiclesList = [];
                    if (fs.existsSync(userVehiclesFilePath)) {
                        userVehiclesList = JSON.parse(fs.readFileSync(userVehiclesFilePath, 'utf8'));
                    }

                    const vehiclesList = userVehiclesList.length > 0
                        ? userVehiclesList.map((v, index) => 
                            `**${index + 1}.** Year: ${v.year}, Make: ${v.make}, Model: ${v.model}, Color: ${v.color}, Number Plate: ${v.numberPlate}`).join('\n')
                        : 'No vehicles registered.';

                    const vehiclesEmbed = new EmbedBuilder()
                        .setTitle(`${selectedUser.tag}'s Registered Vehicles`)
                        .setDescription(vehiclesList)
                        .setColor(0x2B2D31);

                    await i.reply({ embeds: [vehiclesEmbed], ephemeral: true });
                }
            });

            collector.on('end', (collected, reason) => {
                if (reason === 'time') {
                    interaction.editReply({ components: [] }).catch(console.error);
                }
            });
        } catch (error) {
            console.error('Error fetching data:', error);
            await interaction.reply({ content: 'Failed to fetch registered vehicles.', ephemeral: true });
        }
    },
};
