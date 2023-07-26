const { EmbedBuilder, Collection, PermissionsBitField, ModalBuilder, ActionRowBuilder, TextInputBuilder, TextInputStyle, ChannelType } = require('discord.js');
const client = require('..');

client.on('messageCreate', async (message) => {

    const responses = ["Hello there luv!", "How you doing today?", "Did you see THE clip?", "Nerf dead hard, am I right?", "Hi... I hate plague... Please delete her", "Good night!", "I hate you..."]

    if(message.author.bot) return;
    let chance = Math.floor(Math.random() * 100);;
    //console.log(message.content);
    if(chance <= 5){
        if(message.channel.parent === "1120755646728507462" || message.channel.parent === "1121188483780845609") return;
        message.react('❤️')
    }

    if(message.content.toLowerCase().startsWith("hi jess") || message.content.toLowerCase().startsWith("hello jess") || message.content.toLowerCase().startsWith("greetings jess")){
        if(chance > 10){
            message.reply(`${responses[Math.floor(Math.random() * responses.length)]}`)
        }
    }

    if(message.content === '<:thumbs:1124016564014944296>'){
        message.reply('<:thumbs:1124016564014944296>')
    }
});