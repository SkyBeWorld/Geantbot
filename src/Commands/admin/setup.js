const { SlashCommandBuilder, CommandInteraction, PermissionFlagsBits, ChatInputCommandInteraction, Client, EmbedBuilder, ActionRowBuilder, ButtonBuilder, ButtonStyle, ComponentType, Events } = require("discord.js")
const ms = require("ms") 
const { translation } = require("../../utils/translation")

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
        const embed = new EmbedBuilder()
        .setTitle(`${await translation("Setting up your server!", guild)}`).setColor("Orange")

        switch (value) {
            case true:
                embed.setDescription(`${await translation("Let's starting.\n\nWe'll help you for setup your server!", guild)}`)

                const row = new ActionRowBuilder().addComponents(
                    new ButtonBuilder()
                    .setStyle(ButtonStyle.Primary)
                    .setCustomId("next-setup")
                    .setLabel(`${await translation("Next", guild)}`),
                )

                const m = await interaction.editReply({embeds: [embed], components: [row]})

                client.on(Events.InteractionCreate, async (i) => {
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
                    } else if (i.customId === "english") {
                        embed.setDescription(`${await translation(`You server server is configured!`, guild)}`)

                        await interaction.editReply({embeds: [embed], components: []})
                    } else if (i.customId === "french") {
                        embed.setDescription(`${await translation(`You server server is configured!`, guild)}`)

                        await interaction.editReply({embeds: [embed], components: []})
                    }
                })
                break;
            case false:

                break;
            default:
                break;
        }
    }
}