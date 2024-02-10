const { SlashCommandBuilder, CommandInteraction, PermissionFlagsBits, ChatInputCommandInteraction, Client, EmbedBuilder, ActionRowBuilder, ButtonBuilder, ButtonStyle, ComponentType } = require("discord.js")
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
        await interaction.reply({content: `${await translation("soon™", guild)}`, ephemeral: true})
    }
}