const { SlashCommandBuilder, CommandInteraction, PermissionFlagsBits, ChatInputCommandInteraction, Client, EmbedBuilder, ActionRowBuilder, ButtonBuilder, ButtonStyle } = require("discord.js") 
const translation = require("../../utils/translation")

module.exports = {
    data: new SlashCommandBuilder()
    .setName("warnings")
    .setNameLocalizations({
        fr: "avertissement"
    })
    .setDescription("warning someone")
    .setDescriptionLocalizations({
        fr: "avertir quelqu'un"
    })
    .setDefaultMemberPermissions(PermissionFlagsBits.ModerateMembers)
    .addSubcommand(subcommand =>
        subcommand.setName("add").setNameLocalizations({fr: "ajouter"})
        .setDescription("Add warning on someone").setDescriptionLocalizations({fr: "Ajouter un avertissement a quelqu'un"})
        .addUserOption(option => option.setName("user").setNameLocalizations({fr: "utilisateur"}).setDescription("user to warn").setDescriptionLocalizations({fr: "l'utilisateur a avertir"}).setRequired(true))
    ),
    /**
     * @param {Client} client,
     * @param {CommandInteraction} interaction
     */
    async execute (interaction, client) {
        const { guild } = interaction
    }
}