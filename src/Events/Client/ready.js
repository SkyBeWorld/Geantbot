const { Client, ActivityType, Status, Events } = require("discord.js")
const { connect } = require("mongoose")
const config = require("../../../config.json")

module.exports = {
    name: Events.ClientReady,
    once: true,
    /**
     * @param {Client} client
     */
    async execute(client) {
        console.log(`${client.user.tag} is now online`)

        if (!config.mongodbURL) return;
        connect(config.mongodbURL).then(() => {
            console.log("[DATABASE] database successfully connected !")
        }).catch(err => console.log("[DATABASE] An error has been detected : \n" + err))
    }
}