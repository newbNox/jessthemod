const { EmbedBuilder } = require('discord.js');
const client = require('..');
const config = require('../config.json')

client.on('guildMemberUpdate', async (om, nm) => {

    let stoinkyGuild = client.guilds.cache.get('1059064132499943495');
    let logchannel = stoinkyGuild.channels.cache.find(ch => ch.id === config.logchannel);
    let changesDetected = false;

    let memberUpdateEmbed = new EmbedBuilder()
        .setAuthor({name: `Member Updated`})
        .setColor("Blurple")
        .setTimestamp()
        .addFields({name: `User`, value: `${nm}`, inline: true}, {name: `ID`, value: `\`${nm.user.id}\``, inline: true})
        .setThumbnail(nm.displayAvatarURL())


    if(om.nickname !== nm.nickname){
        changesDetected = true
        memberUpdateEmbed.addFields({name: `Nickname changed`, value: `${om.nickname} ➡️ ${nm.nickname}`})

        if(changesDetected){
            logchannel.send({embeds: [memberUpdateEmbed]})
        }
    }
   
});