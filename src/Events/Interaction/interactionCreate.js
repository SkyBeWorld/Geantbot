const { Client, ActivityType, Status, Events, BaseInteraction } = require("discord.js")

module.exports = {
    name: Events.InteractionCreate,
    /**
     * @param {Client} client
     * @param {BaseInteraction} interaction
     */
    async execute(interaction, client) {
        if (!interaction.isChatInputCommand()) return;

        const command = client.commands.get(interaction.commandName)

        if (!command) {
            interaction.reply({content: '❌・Outdated command'})
        }

        command.execute(interaction, client)
    }
}