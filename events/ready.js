const client = require('..');
const { ActivityType, EmbedBuilder } = require('discord.js');

const TwitchAPI = require('node-twitch').default;
const twitch = new TwitchAPI({
    client_id: 'v3qta9ytks34iqfk3zqkdq2coap8a0',
    client_secret: 'qk130u3oj4vx6qvbyeuietu0osjguf'
})

let liveMemory = false;
let liveData;

client.on("ready", () => {
    client.user.setActivity({name: `TheStoinkers`, type: ActivityType.Watching, url: "https://twitch.tv/thestoinkers"});
    setInterval(() => {
        client.user.setActivity({name: `TheStoinkers`, type: ActivityType.Watching, url: "https://twitch.tv/thestoinkers"});
    }, 5000);

    console.log(`Logged in as ${client.user.tag}!`)

    //setInterval(twitchFetch, 30000)


})


const twitchFetch = async function TwitchFetch() {
    await twitch.getStreams({channel: "thestoinkers"}).then(async data => {
        liveData = data.data[0]

        if(liveData !== undefined){
            if(liveData.type === 'live'){
                if(liveMemory === false || liveMemory === undefined){
                    liveMemory = true
                    PostLive()
                }
            } else {
                if(liveMemory === true){
                    liveMemory = false
                }
            }
        } else {
            if(liveMemory === true){
                liveMemory = false
            }
        }
    })
}

async function PostLive(){
    let stoinkyguild = client.guilds.cache.get('1059064132499943495');
    let alertchannel = stoinkyguild.channels.cache.find(ch => ch.id === '1117940227076534322');

    const response = await fetch(`https://api.twitch.tv/helix/games?id='${liveData.game_id}'`, {method: "GET", headers: {
        "Authorization": "qk130u3oj4vx6qvbyeuietu0osjguf",
        "Client-Id": "v3qta9ytks34iqfk3zqkdq2coap8a0"
    }})

    const gameData = response ? response.json() : null;

    let embed = new EmbedBuilder()

        .setTitle(`Stoinky is Live!`)
        .setURL("https://twitch.tv/thestoinkers")
        .setDescription(`https://twitch.tv/thestoinkers\n\nOur beloved Stoinker has started streaming, get your butts there **NOW!**`)
        .addFields(
            {name: `Title`, value: `${liveData.title}`, inline: true},
        )

    if(gameData || gameData !== null){
        embed.addFields(`Game/Category`, `${gameData.data[0].name}`)
    }

    await alertchannel.send({embeds: [embed]});
}