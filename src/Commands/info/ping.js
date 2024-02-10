const { SlashCommandBuilder, CommandInteraction, PermissionFlagsBits, ChatInputCommandInteraction, Client, EmbedBuilder, ActionRowBuilder, ButtonBuilder, ButtonStyle } = require("discord.js") 

module.exports = {
    data: new SlashCommandBuilder()
    .setName("ping")
    .setNameLocalizations({
        fr: "ping"
    })
    .setDescription("get ping the bot")
    .setDescriptionLocalizations({
        fr: "avoir le ping le bot"
    }),
    /**
     * @param {Client} client,
     * @param {CommandInteraction} interaction
     */
    async execute (interaction, client) {
        await interaction.reply({content: `:ping_pong: pong!\n\`\`${client.ws.ping} ms\`\``})
    }
}