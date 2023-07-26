const { EmbedBuilder } = require('discord.js');
const client = require('..');
const config = require('../config.json')

client.on('messageDelete', async (msg) => {

    if(!msg.author || msg.author.bot) return;

    let stoinkyGuild = client.guilds.cache.get('1059064132499943495');
    let logchannel = stoinkyGuild.channels.cache.find(ch => ch.id === config.logchannel)

    const deleteLogs = await stoinkyGuild.fetchAuditLogs({
        limit: 10,
        type: 72
    }).catch(console.error)

    const auditEntry = deleteLogs.entries.find(a => a.targetId === msg.author.id);
    const executor = auditEntry ? auditEntry.executor.tag : "Unknown";

    let msgContent = msg.content.slice(0, 1024)

    let logMsg = new EmbedBuilder()
        .setAuthor({name: `Message Deleted`})
        .setColor("Red")
        .setTimestamp()
        .addFields(
            {name: `Message content`, value: `${msgContent}`},
            {name: `Channel`, value: `${msg.channel}`, inline: true},
            {name: `Author`, value: `${msg.author}`, inline: true},
            {name: `Author ID`, value: `\`${msg.author.id}\``, inline: true},
            {name: `Deleted by`, value: `${executor}`}
        )

    if(executor !== "Unknown"){
        logchannel.send({embeds: [logMsg]})
    } else {
        logMsg.setDescription(`Check Audit Logs to see who deleted the messsage.`);
        logchannel.send({embeds: [logMsg]})
    }
    


});