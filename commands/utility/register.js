const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');
const fs = require('fs');
const path = require('path');

const dataDirPath = path.join(__dirname, '../../data/vehicleData');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('register')
        .setDescription('Register your vehicle.')
        .addIntegerOption(option =>
            option.setName('year')
                .setDescription('Vehicle Year')
                .setRequired(true))
        .addStringOption(option =>
            option.setName('make')
                .setDescription('Vehicle Make')
                .setRequired(true))
        .addStringOption(option =>
            option.setName('model')
                .setDescription('Vehicle Model')
                .setRequired(true))
        .addStringOption(option =>
            option.setName('color')
                .setDescription('Vehicle Color')
                .setRequired(true))
        .addStringOption(option =>
            option.setName('number-plate')
                .setDescription('Vehicle Number Plate')
                .setRequired(true)),

    async execute(interaction) {
        await interaction.deferReply({ ephemeral: true });

        try {
            const vehicleData = collectVehicleData(interaction);
            const userId = interaction.user.id;

            saveVehicleData(userId, vehicleData);

            const embed = createVehicleEmbed(vehicleData);
            await interaction.editReply({ embeds: [embed], ephemeral: true });
        } catch (error) {
            console.error('Error processing vehicle registration:', error);
            await interaction.editReply({ content: 'There was an error while processing your request.', ephemeral: true });
        }
    },
};

function collectVehicleData(interaction) {
    return {
        year: interaction.options.getInteger('year'),
        make: interaction.options.getString('make'),
        model: interaction.options.getString('model'),
        color: interaction.options.getString('color'),
        numberPlate: interaction.options.getString('number-plate')
    };
}

function saveVehicleData(userId, vehicleData) {
    if (!fs.existsSync(dataDirPath)) {
        fs.mkdirSync(dataDirPath, { recursive: true });
    }

    const userFilePath = path.join(dataDirPath, `${userId}.json`);

    let userVehicleData = [];
    if (fs.existsSync(userFilePath)) {
        userVehicleData = JSON.parse(fs.readFileSync(userFilePath, 'utf8'));
    }

    userVehicleData.push(vehicleData);

    fs.writeFileSync(userFilePath, JSON.stringify(userVehicleData, null, 2), 'utf8');
}

function createVehicleEmbed(vehicleData) {
    return new EmbedBuilder()
        .setTitle('Vehicle Registered')
        .setDescription(`Vehicle registred, excute the command /profile to view all of your vehicles.`)
        .setColor('#89cff0')
}
