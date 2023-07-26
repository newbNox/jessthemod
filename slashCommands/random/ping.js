const { EmbedBuilder, ApplicationCommandType } = require('discord.js');

module.exports = {
    name: 'ping',
    description: 'Ping Pong',
    cooldown: 3000,
    type: ApplicationCommandType.ChatInput,

        run: async (client, interaction) => {
            const { member, channelId, guildId, applicationId, 
                commandName, deferred, replied, ephemeral, 
                options, id, createdTimestamp 
            } = interaction; 
            const { guild } = member;

           interaction.reply(`Pong \`${Date.now() - interaction.createdTimestamp}ms\``);
        }
}