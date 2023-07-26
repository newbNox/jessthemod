const { EmbedBuilder, ApplicationCommandType, ButtonStyle, ButtonBuilder, ActionRowBuilder } = require('discord.js');
const { QuickDB } = require('quick.db');
const db = new QuickDB();

module.exports = {
    name: 'numbergame',
    description: 'Gives you a really "funny" dad joke',
    cooldown: 3000,
    type: ApplicationCommandType.ChatInput,
    options: [
        {
            name: `number`,
            description: `Select correct number to guess`,
            type: 4,
            required: true
        },
        {
            name: `prize`,
            description: `Select "optional" prize for the game`,
            type: 3,
            required: false
        }
    ],

        run: async (client, interaction) => {
            const { member, channelId, guildId, applicationId, 
                commandName, deferred, replied, ephemeral, 
                options, id, createdTimestamp 
            } = interaction; 
            const { guild } = member;

            if(!member.roles.cache.get('1117938038484512841')) return interaction.reply({content: `Sorry bro, you can't do this...`, ephemeral: true})
            let selectedInt = options.getInteger('number')
            let prize = options.getString('prize') ? options.getString('prize') : null;

            db.set(`numbergame_${channelId}`, selectedInt);

            interaction.reply({content: `Number game hosted in ${interaction.channel}, correct number is \`${selectedInt}\``, ephemeral: true})

            let guessNumber = new ButtonBuilder()
                .setLabel('Guess The Number!!')
                .setStyle(ButtonStyle.Success)
                .setCustomId('guessNumber')

            const row = new ActionRowBuilder()
                .addComponents(guessNumber)

            let numberGame = new EmbedBuilder()
                .setTitle(`GUESS THE CORRECT NUMBER!`)
                .setColor("Random")
                .setDescription(`:tada: ${member} is hosting a 'Guess The Correct Number' game round!\n\nAll you need to do is to guess the correct number, and win!`)

            if(prize !== null){
                db.set(`numbergame_${channelId}_prize`, prize)
                numberGame.addFields(
                    {name: `Prize`, value: `${prize}`}
                )
            }
            interaction.channel.send({embeds: [numberGame], components: [row]}).then(msg => {
                db.set(`numbergame_${channelId}_msgid`, msg.id)
            });

        }
}