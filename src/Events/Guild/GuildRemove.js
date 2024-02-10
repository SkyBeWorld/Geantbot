const { Client, ActivityType, Status, Events, BaseGuild } = require("discord.js")
const Schema = require("../../Schemas/GuildSettings")

module.exports = {
    name: Events.GuildDelete,
    /**
     * @param {Client} client
     * @param {BaseGuild} guild
    */
    async execute (guild, client) {
        await Schema.deleteOne({ GuildId: guild.id }).catch(err => {  })
    }
}