const { SlashCommandBuilder, EmbedBuilder, StringSelectMenuBuilder, StringSelectMenuOptionBuilder, ActionRowBuilder, PermissionFlagsBits, PermissionsBitField } = require('discord.js');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('server-information')
        .setDefaultMemberPermissions(PermissionsBitField.Flags.Administrator)
        .setDescription('Gives Server Information'),
    async execute(interaction) {

        const embed1 = new EmbedBuilder()
            .setTitle('Server Information')
            .setDescription(`> Welcome to Mythville! Read the rules below to get to know the server more well.`)
            .setColor(0xc45656);

        const embed2 = new EmbedBuilder()
            .setTitle('Rule 1: No NSFW')
            .setDescription('>  Spamming and posting NSFW content is strictly prohibited.')
            .setColor(0xc45656);
            
        const embed3 = new EmbedBuilder()
            .setTitle('Rule 2: Vehicle Registration Limits')
            .setDescription('> Do not register more vehicles than allowed. Refer to the pinned message in the vehicle registration channel for limits.')
            .setColor(0xc45656);
            
        const embed4 = new EmbedBuilder()
            .setTitle('Rule 3: No Alternative Accounts:')
            .setDescription('> Alternative accounts are not permitted. If you believe a ban is unjust or have evidence to appeal a ban, contact an administrator directly.')
            .setColor(0xc45656); 

        const embed5 = new EmbedBuilder()
            .setTitle('Rule 4: Direct Message Conduct:')
            .setDescription(`> While there are no specific rules for direct messages, Mythville Administration reserves the right to take action based on interactions with server members.`)
            .setColor(0xc45656);
        
        const embed6 = new EmbedBuilder()
            .setTitle('Rule 5: No Impersonation')
            .setDescription('> Impersonation of other members or the staff — deliberry using their names or avatars of other members or the staff is strictly prohibited. Substitution is deceit, and it will be punished.')
            .setColor(0xc45656);
        
        const embed7 = new EmbedBuilder()
            .setTitle('Rule 6: Follow Discord Terms of Service')
            .setDescription(`> All users are to keep within the boundaries of Discord's Terms of Service and Community Guidelines. None of the activities or behaviors that violate said terms are allowed to be practiced here in this server.`)
            .setColor(0xc45656);
            
        const selectMenu = new StringSelectMenuBuilder()
            .setCustomId('information_select')
            .setPlaceholder('Select an option')
            .addOptions(
                new StringSelectMenuOptionBuilder()
                    .setLabel('Session Guidelines')
                    .setDescription('Guidlines for the session.')
                    .setValue('sguild'),
                new StringSelectMenuOptionBuilder()
                    .setLabel('Server Links')
                    .setDescription('Link connected to the server Server.')
                    .setValue('ss'),
                new StringSelectMenuOptionBuilder()
                    .setLabel('Server Support')
                    .setDescription('Get help in the server')
                    .setValue('ses')
            );

        const row = new ActionRowBuilder().addComponents(selectMenu);

        await interaction.reply({ content: 'Command Sent Below.', ephemeral: true });

        async function sendEmbedMessages() {
            await interaction.channel.send({ embeds: [embed1, embed2, embed3, embed4, embed5, embed6, embed7], components: [row] });
        }

        try {
            await sendEmbedMessages();
        } catch (error) {
            console.error('Error sending embed messages:', error);
        }
    },
};
