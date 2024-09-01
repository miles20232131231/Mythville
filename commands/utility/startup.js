const { SlashCommandBuilder, EmbedBuilder, PermissionsBitField } = require('discord.js');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('startup')
        .setDescription('Sends a startup embed')
        .setDefaultMemberPermissions(PermissionsBitField.Flags.MuteMembers)
        .addIntegerOption(option =>
            option.setName('reactions')
                .setDescription('Amount of reactions for the session to occur')
                .setRequired(true)),
    async execute(interaction) {
        const reactions = interaction.options.getInteger('reactions');
        const user = interaction.user;

        // Define the embed
        const embed = new EmbedBuilder()
            .setTitle('Mythville | Session Startup')
            .setDescription(`<@${interaction.user.id}> started a session! Are you guys ready to start the session? Kindly make sure to check out <#1232649682166222858> for important information before participating.

                > To register your vehicle, run /register and fill out the vehicle information. Then you can run /unregister to remove the vehicle.
                
                The session shall begin once this hits **__${reactions}+__**`)

        // Send the message with the embed
        const message = await interaction.channel.send({
            content: '@everyone',
            embeds: [embed]
        });

        await message.react('✅');

        const newEmbed = new EmbedBuilder()
            .setTitle("Session Startup")
            .setDescription(`<@${interaction.user.id}> has started up a session in <#1262427401648869427>.
                Reactions have been set to ${reactions}`)

        const targetChannel = await interaction.client.channels.fetch('1279812069767643361');
        await targetChannel.send({ embeds: [newEmbed] });

        const filter = (reaction, user) => reaction.emoji.name === '✅';

        const collector = message.createReactionCollector({ filter, time: 86400000 });

        collector.on('collect', (reaction, user) => {
            console.log(`Collected ${reaction.count} reactions`);
            if (reaction.count >= reactions) {
                const settingUpEmbed = new EmbedBuilder()
                    .setDescription('Setting up!')
                interaction.channel.send({ embeds: [settingUpEmbed] });
                collector.stop();
            }
        });

        collector.on('end', collected => {
            console.log(`Collector ended. Total reactions: ${collected.size}`);
        });

        await interaction.reply({ content: `You Have Initiated A Session Successfully.`, ephemeral: true });
    },
};
