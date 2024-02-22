const { SlashCommandBuilder, CommandInteraction, PermissionFlagsBits, ChatInputCommandInteraction, Client, EmbedBuilder, ActionRowBuilder, ButtonBuilder, ButtonStyle, ComponentType, Events, ChannelSelectMenuBuilder, ChannelType, ModalBuilder, TextInputBuilder, TextInputStyle } = require("discord.js")
const ms = require("ms") 
const { translation } = require("../../utils/translation")
const GuildData = require("../../Schemas/GuildSettings")

module.exports = {
    data: new SlashCommandBuilder()
    .setName("setup")
    .setNameLocalizations({
        fr: "configurer"
    })
    .setDescription("setup the server")
    .setDescriptionLocalizations({
        fr: "configurer le serveur"
    })
    .setDefaultMemberPermissions(PermissionFlagsBits.Administrator)
    .addBooleanOption(option => 
        option.setName("fast-setup")
        .setDescription("fast setup for your server")
        .setDescriptionLocalizations({
            fr: "fast setup pour votre serveur"
        })
        .setRequired(true)),
    /**
     * @param {Client} client,
     * @param {CommandInteraction} interaction
     */
    async execute (interaction, client) {
        const { guild } = interaction
        const value = interaction.options.getBoolean("fast-setup")
        await interaction.deferReply({ephemeral: true})
        const embed = new EmbedBuilder().setColor("Random")
        .setTitle(`${await translation("Setting up your server!", guild)}`)
        const data = await GuildData.findOne({GuildId: guild.id}).catch(err => {  })
        if (!data) return interaction.editReply({content: `You server doesn't have any datas in the database! We are creating your datas and try again...`}).then(async (e) => {
            await GuildData.create({
                GuildId: guild.id,
                language: "english",
                WelcomeChannel: "0",
                WelcomeMessage: "Welcome to {server.name} {user.mention}",
                GoodbyeChannel: "0",
                GoodbyeMessage: "Goodbye {user.name}"
            })
        });

        switch (value) {
            case true:
                embed.setDescription(`${await translation("Let's starting.\n\nWe'll help you for setup your server!\n\n**Attention, this is replace your old data in the database**", guild)}`)

                const row = new ActionRowBuilder().addComponents(
                    new ButtonBuilder()
                    .setStyle(ButtonStyle.Primary)
                    .setCustomId("next-setup")
                    .setLabel(`${await translation("Next", guild)}`),
                )

                const m = await interaction.editReply({embeds: [embed], components: [row]})

                client.on(Events.InteractionCreate, async (i) => {
                    if (i.user.id !== interaction.user.id) return;
                    // buttons
                    if (i.customId === "next-setup") {
                        embed.setDescription(`${await translation(`What language do you speak?\n\n\n> 🇫🇷 French\n> 🇬🇧 English`, guild)}`)

                        const row = new ActionRowBuilder().addComponents(
                            new ButtonBuilder()
                            .setStyle(ButtonStyle.Secondary)
                            .setCustomId("english")
                            .setLabel(`${await translation("English", guild)}`)
                            .setEmoji("🇬🇧"),

                            new ButtonBuilder()
                            .setStyle(ButtonStyle.Secondary)
                            .setCustomId("french")
                            .setLabel(`${await translation("French", guild)}`)
                            .setEmoji("🇫🇷"),
                        )

                        await interaction.editReply({embeds: [embed], components: [row]})
                    } else if (i.customId === "next-welcome") {
                        embed.setDescription(`${await translation(`Time for configure goodbye Channel`, guild)}`)
                        const row = new ActionRowBuilder().addComponents(
                            new ChannelSelectMenuBuilder()
                            .setChannelTypes(ChannelType.GuildText)
                            .setCustomId("channel-goodbye")
                            .setMinValues(1)
                            .setMaxValues(1)
                            .setPlaceholder(`${await translation("Select the channel", guild)}`)
                        )

                        await interaction.editReply({embeds: [embed], components: [row]})
                    } else if (i.customId === "next-goodbye") {
                        embed.setDescription(`${await translation(`Well done. You finished to configure your server, see you soon\n\n## If you want configure welcome message, goodbye message please go to the dashboard or use the setup panel.`, guild)}`)

                        await interaction.editReply({embeds: [embed], components: []})
                        await data.save()
                    }
                    
                    // languages
                    if (i.customId === "english") {
                        data.language = "english"
                        embed.setDescription(`${await translation(`Time for configure Welcome Channel`, guild)}`)
                        const row = new ActionRowBuilder().addComponents(
                            new ChannelSelectMenuBuilder()
                            .setChannelTypes(ChannelType.GuildText)
                            .setCustomId("channel-welcome")
                            .setMinValues(1)
                            .setMaxValues(1)
                            .setPlaceholder(`${await translation("Select the channel", guild)}`)
                        )

                        await interaction.editReply({embeds: [embed], components: [row]})
                    } else if (i.customId === "french") {
                        data.language = "french"
                        embed.setDescription(`${await translation(`Time for configure Welcome Channel`, guild)}`)
                        const row = new ActionRowBuilder().addComponents(
                            new ChannelSelectMenuBuilder()
                            .setChannelTypes(ChannelType.GuildText)
                            .setCustomId("channel-welcome")
                            .setMinValues(1)
                            .setMaxValues(1)
                            .setPlaceholder(`${await translation("Select the channel", guild)}`)
                        )

                        await interaction.editReply({embeds: [embed], components: [row]})
                    }

                    // channels
                    if (i.customId === "channel-welcome") {
                        data.WelcomeChannel = i.values[0]
                        embed.setDescription(`${await translation(`You selected <#${i.values[0]}>\n\nclick next for configure goodbye channel`, guild)}`)

                        const row = new ActionRowBuilder().addComponents(
                            new ButtonBuilder()
                            .setStyle(ButtonStyle.Primary)
                            .setCustomId("next-welcome")
                            .setLabel(`${await translation("Next", guild)}`),
                        )

                        await interaction.editReply({embeds: [embed], components: [row]})
                    } else if (i.customId === "channel-goodbye") {
                        data.GoodbyeChannel = i.values[0]
                        embed.setDescription(`${await translation(`You selected <#${i.values[0]}>\n\nclick next for continue the configuration!`, guild)}`)

                        const row = new ActionRowBuilder().addComponents(
                            new ButtonBuilder()
                            .setStyle(ButtonStyle.Primary)
                            .setCustomId("next-goodbye")
                            .setLabel(`${await translation("Next", guild)}`),
                        )

                        await interaction.editReply({embeds: [embed], components: [row]})
                    }
                })
                break;
            case false:
                embed.setDescription(`this embed is not translated.\n\n> Language: ${data.language}\n> Welcome Channel: <#${data.WelcomeChannel}>\n> Welcome message: ${data.WelcomeMessage}\n> Goodbye Channel: <#${data.GoodbyeChannel}>\n> Goodbye message: ${data.GoodbyeMessage}\n\n\n## You can edit with buttons below!`)

                const rows = new ActionRowBuilder().addComponents(
                    new ButtonBuilder()
                    .setStyle(ButtonStyle.Secondary)
                    .setCustomId("language-edit")
                    .setLabel(`${await translation("Language", guild)}`),

                    new ButtonBuilder()
                    .setStyle(ButtonStyle.Secondary)
                    .setCustomId("welcome-channel")
                    .setLabel(`${await translation("Welcome Channel", guild)}`),

                    new ButtonBuilder()
                    .setStyle(ButtonStyle.Secondary)
                    .setCustomId("goodbye-channel")
                    .setLabel(`${await translation("Goodbye Channel", guild)}`),
                )

                await interaction.editReply({embeds: [embed], components: [rows]})

                client.on(Events.InteractionCreate, async (e) => {
                    // main buttons
                    if (e.customId === "language-edit") {
                        embed.setDescription(`${await translation(`the current language is ${data.language}\n\n\nselect a supported language!`, guild)}`)

                        const row = new ActionRowBuilder().addComponents(
                            new ButtonBuilder()
                            .setStyle(ButtonStyle.Secondary)
                            .setCustomId("french-edit")
                            .setLabel("French")
                            .setEmoji("🇫🇷"),

                            new ButtonBuilder()
                            .setStyle(ButtonStyle.Secondary)
                            .setCustomId("english-edit")
                            .setLabel("English")
                            .setEmoji("🇬🇧"),
                        )

                        await interaction.editReply({embeds: [embed], components: [row]})
                    } else if (e.customId === "welcome-channel") {
                        embed.setDescription(`${await translation(`the current channel is ${data.WelcomeChannel}\n\n\nselect the channel!`, guild)}`)

                        const row = new ActionRowBuilder().addComponents(
                            new ChannelSelectMenuBuilder()
                            .setChannelTypes(ChannelType.GuildText)
                            .setCustomId("channel-welcome-edit")
                            .setMinValues(1)
                            .setMaxValues(1)
                            .setPlaceholder(`${await translation("Select the channel", guild)}`)
                        )

                        await interaction.editReply({embeds: [embed], components: [row]})
                    } else if (e.customId === "goodbye-channel") {
                        embed.setDescription(`${await translation(`the current channel is ${data.GoodbyeChannel}\n\n\nselect the channel!`, guild)}`)

                        const row = new ActionRowBuilder().addComponents(
                            new ChannelSelectMenuBuilder()
                            .setChannelTypes(ChannelType.GuildText)
                            .setCustomId("channel-goodbye-edit")
                            .setMinValues(1)
                            .setMaxValues(1)
                            .setPlaceholder(`${await translation("Select the channel", guild)}`)
                        )

                        await interaction.editReply({embeds: [embed], components: [row]})
                    }


                    // others buttons
                    if (e.customId === "french-edit") {
                        data.language === "french"
                        embed.setDescription(`${await translation("Sucessfully edited the database!", guild)}`)

                        await data.save()

                        await interaction.editReply({embeds: [embed], components: []})
                    } else if (e.customId === "english-edit") {
                        data.language = "english"
                        embed.setDescription(`${await translation("Sucessfully edited the database!", guild)}`)

                        await data.save()

                        await interaction.editReply({embeds: [embed], components: []})
                    }

                    // cancel
                    if (e.customId === "cancel") {
                        await interaction.editReply({content: `${await translation("Canceled", guild)}`, embeds: [], components: []})
                    }
                })
                break;
            default:
                break;
        }
    }
}