const { Client, ActivityType, Status, Events } = require("discord.js")

module.exports = {
    name: Events.ClientReady,
    once: true,
    /**
     * @param {Client} client
     */
    async execute(client) {
        console.log(`${client.user.tag} is now online`)
    }
}