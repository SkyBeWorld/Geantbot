const { Client, ActivityType, Status, Events, BaseGuild } = require("discord.js")
const Schema = require("../../Schemas/GuildSettings")

module.exports = {
    name: Events.GuildCreate,
    /**
     * @param {Client} client
     * @param {BaseGuild} guild
    */
    async execute (guild, client) {
        const data = await Schema.findOne({ GuildId: guild.id }).catch(err => {  })

        if (!data) {
            Schema.create({
                GuildId: guild.id,
                language: "english"
            })
        } else {
            console.log("this server already got datas!")
        }
    }
}