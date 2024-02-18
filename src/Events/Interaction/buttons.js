const { Client, ActivityType, Status, Events, BaseInteraction, EmbedBuilder } = require("discord.js");
const { translation } = require("../../utils/translation");

module.exports = {
    name: Events.InteractionCreate,
    /**
     * @param {Client} client
     * @param {BaseInteraction} interaction
     */
    async execute(interaction, client) {
        if (!interaction.isButton()) return;
    }
}