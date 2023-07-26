const { EmbedBuilder, ApplicationCommandType } = require('discord.js');
var giveMeAJoke = require('give-me-a-joke');

module.exports = {
    name: 'dadjoke',
    description: 'Gives you a really "funny" dad joke',
    cooldown: 3000,
    type: ApplicationCommandType.ChatInput,

        run: async (client, interaction) => {
            const { member, channelId, guildId, applicationId, 
                commandName, deferred, replied, ephemeral, 
                options, id, createdTimestamp 
            } = interaction; 
            const { guild } = member;

            giveMeAJoke.getRandomDadJoke(function(joke){
                interaction.reply(`${joke}`);
            })
        }
}