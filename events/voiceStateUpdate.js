const { EmbedBuilder, PermissionsBitField } = require('discord.js');
const client = require('..');
const config = require('../config.json')

client.on('voiceStateUpdate', async (os, ns) => {
    //console.log(os)

    if(ns.channelId === '1124113801227288677'){
        ns.guild.channels.create({
            type: 2,
            parent: '1124114187824660612',
            name: `${ns.member.user.username}'s Channel`,
            userLimit: 3,
            permissionOverwrites: [
                {
                    id: ns.member.id,
                    allow: [PermissionsBitField.Flags.ManageChannels, PermissionsBitField.Flags.MuteMembers, PermissionsBitField.Flags.DeafenMembers, PermissionsBitField.Flags.PrioritySpeaker]
                }
            ]
        }).then(newVoice => {
            return ns.member.voice.setChannel(newVoice);
        })
    }

    if(os.channelId !== null && os.channel.parentId === '1124114187824660612'){
        if(os.channelId !== '1124113801227288677'){
            if(os.channel.members.size <= 0){
                os.channel.delete("Not used anymore")
            }
        }
    }
});