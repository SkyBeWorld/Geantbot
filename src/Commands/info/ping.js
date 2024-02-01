const { SlashCommandBuilder, CommandInteraction, PermissionFlagsBits, ChatInputCommandInteraction, Client, EmbedBuilder, ActionRowBuilder, ButtonBuilder, ButtonStyle } = require("discord.js") 

module.exports = {
    data: new SlashCommandBuilder()
    .setName("ping")
    .setDescription("ping the bot"),
    /**
     * @param {Client} client,
     * @param {CommandInteraction} interaction
     */
    async execute (interaction, client) {
        await interaction.reply({content: `:ping_pong: pong!\n\`\`${client.ws.ping} ms\`\``})
    }
}