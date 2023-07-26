

const { EmbedBuilder, Collection, PermissionsBitField, ModalBuilder, ActionRowBuilder, TextInputBuilder, TextInputStyle, ChannelType, Embed, ButtonBuilder, ButtonStyle } = require('discord.js');
const ms = require('ms');
const client = require('..');
const config = require('../config.json');
const { QuickDB } = require('quick.db');
const db = new QuickDB();

const cooldown = new Collection();

client.on('interactionCreate', async interaction => {

	// MODALIT
	if(interaction.isModalSubmit()){
		if(interaction.customId === 'guessNumberMobal'){
			let correctNumber = await db.get(`numbergame_${interaction.channelId}`)
			let guessNumber = interaction.fields.getTextInputValue('numberGuess')
			if(isNaN(guessNumber)) return interaction.reply({content: `Your guess: \`${guessNumber}\` **is not** valid number!`, ephemeral: true})
			if(correctNumber === Number(guessNumber)){
				interaction.reply({content: `You guessed the correct number! :tada:`, ephemeral: true})
				db.delete(`numbergame_${interaction.channelId}`)
				let guessMsg = await interaction.channel.messages.fetch(await db.get(`numbergame_${interaction.channelId}_msgid`), {force: true});
				//let guessMsgEmbed = guessMsg.embeds[0];

				let guessNumber = new ButtonBuilder()
                .setLabel('Guess The Number!!')
                .setStyle(ButtonStyle.Success)
                .setCustomId('guessNumber')
				.setDisabled(true)

            	const row = new ActionRowBuilder()
                .addComponents(guessNumber)

				let winner = new EmbedBuilder()
				.setTitle(`GUESS THE CORRECT NUMBER`)
				.setThumbnail(interaction.member.user.displayAvatarURL())
				.setDescription(`${interaction.member} guessed the correct number!! **Congratulations!** Correct number was \`${correctNumber}\``)
				.setTimestamp()

				guessMsg.edit({embeds: [winner], components: [row]})

				db.delete(`numbergame_${interaction.channelId}_msgid`)
				db.delete(`numbergame_${interaction.channelId}_prize`)
			} else {
				interaction.reply({content: `Unfortunately the correct number was not \`${guessNumber}\` :sob:`, ephemeral: true})
			}
		}
	}

	// NAPPULAT
	if(interaction.isButton()){
		if(interaction.customId === 'guessNumber'){
			let lastGuess = await db.get(`guessCooldown_${interaction.user.id}`)
			const cooldown = 24 * 60 * 60 * 1000; // 1 day
			if(lastGuess !== null && cooldown - (Date.now() - lastGuess) > 0){
				interaction.reply({embeds: [new EmbedBuilder().setDescription(`${interaction.member}, you need to wait for ${ms(cooldown - (Date.now() - lastGuess))} before guessing again!`)], ephemeral: true})
			} else {
				if(db.get(`numbergame_${interaction.channelId}`)){
					const modal = new ModalBuilder()
					.setCustomId('guessNumberMobal')
					.setTitle(`Guess the Number!`);
	
					const numberGuess = new TextInputBuilder()
						.setCustomId('numberGuess')
						.setLabel(`Your guess!`)
						.setRequired(true)
						.setStyle(TextInputStyle.Short);
	
					const firstRow = new ActionRowBuilder().addComponents(numberGuess);
	
					modal.addComponents(firstRow);
	
					interaction.showModal(modal).catch(console.error);
					db.set(`guessCooldown_${interaction.user.id}`, Date.now());
				} else {
					interaction.reply({content: `This game has expired already, someone won already!`})
				}
			}
		}
    }


	const slashCommand = client.slashCommands.get(interaction.commandName);
		if (interaction.type == 4) {
			if(slashCommand.autocomplete) {
				const choices = [];
				await slashCommand.autocomplete(interaction, choices)
			}
		}
		if (!interaction.type == 2) return;
	
		if(!slashCommand) return client.slashCommands.delete(interaction.commandName);
		try {
			if(slashCommand.cooldown) {
				if(cooldown.has(`slash-${slashCommand.name}${interaction.user.id}`)) return interaction.reply({ content: config.messages["COOLDOWN_MESSAGE"].replace('<duration>', ms(cooldown.get(`slash-${slashCommand.name}${interaction.user.id}`) - Date.now(), {long : true}) ) })
				if(slashCommand.userPerms || slashCommand.botPerms) {
					if(!interaction.memberPermissions.has(PermissionsBitField.resolve(slashCommand.userPerms || []))) {
						const userPerms = new EmbedBuilder()
						.setDescription(`🚫 ${interaction.user}, You don't have \`${slashCommand.userPerms}\` permissions to use this command!`)
						.setColor('Red')
						return interaction.reply({ embeds: [userPerms] })
					}
					if(!interaction.guild.members.cache.get(client.user.id).permissions.has(PermissionsBitField.resolve(slashCommand.botPerms || []))) {
						const botPerms = new EmbedBuilder()
						.setDescription(`🚫 ${interaction.user}, I don't have \`${slashCommand.botPerms}\` permissions to use this command!`)
						.setColor('Red')
						return interaction.reply({ embeds: [botPerms] })
					}

				}

					await slashCommand.run(client, interaction);
					cooldown.set(`slash-${slashCommand.name}${interaction.user.id}`, Date.now() + slashCommand.cooldown)
					setTimeout(() => {
							cooldown.delete(`slash-${slashCommand.name}${interaction.user.id}`)
					}, slashCommand.cooldown)
			} else {
				if(slashCommand.userPerms || slashCommand.botPerms) {
					if(!interaction.memberPermissions.has(PermissionsBitField.resolve(slashCommand.userPerms || []))) {
						const userPerms = new EmbedBuilder()
						.setDescription(`🚫 ${interaction.user}, You don't have \`${slashCommand.userPerms}\` permissions to use this command!`)
						.setColor('Red')
						return interaction.reply({ embeds: [userPerms] })
					}
					if(!interaction.guild.members.cache.get(client.user.id).permissions.has(PermissionsBitField.resolve(slashCommand.botPerms || []))) {
						const botPerms = new EmbedBuilder()
						.setDescription(`🚫 ${interaction.user}, I don't have \`${slashCommand.botPerms}\` permissions to use this command!`)
						.setColor('Red')
						return interaction.reply({ embeds: [botPerms] })
					}

				}
					await slashCommand.run(client, interaction);
			}
		} catch (error) {
				console.log(error);
		}
});