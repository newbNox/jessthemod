const { EmbedBuilder } = require('discord.js');
const client = require('..');

client.on('guildMemberAdd', async (nm) => {

    let stoinkyGuild = await client.guilds.cache.get('1059064132499943495');
    let welcomeChannel = await stoinkyGuild.channels.cache.find(ch => ch.id === '1059064133296869399')

    nm.roles.add(['1123350179811180554']);

    const welcomeMsg = new EmbedBuilder()
        .setTitle(`Welcome to 'The Stoinkers' Discord server!`)
        .setThumbnail(nm.user.displayAvatarURL())
        .setImage(`https://media.tenor.com/DzxRADtvLlAAAAAd/dbd-zarina.gif`)
        .setDescription(`We are more than happy to see you here ${nm}! Thank you for joining, and we would highly suggest you to check following channels first, so you know what is going on!\n\n\`=\` <#1117952226003005440>\n\`=\` <#1123351825463128084>\n\`=\` <#1123734250093543485>`)


    welcomeChannel.send({embeds: [welcomeMsg]})
});