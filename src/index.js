const { Client, Partials, Collection } = require("discord.js")
const { Channel, GuildMember, Message, Reaction, ThreadMember, User, GuildScheduledEvent } = Partials
const express = require("express")
const app = express()
const loadCommands = require("./Handlers/CommandsHandler")
const loadEvents = require("./Handlers/EventsHandler")
require("dotenv").config()

const client = new Client({
    intents: 131071,
    partials: [Channel, GuildMember, Message, Reaction, ThreadMember, User, GuildScheduledEvent]
})

client.login(process.env.token).then(async (e) => {
    loadEvents(client)
    loadCommands(client)
}).catch(async (err) => {
    console.log("[ERROR]: " + err)
})

// collections

client.commands = new Collection()
module.exports.Client = client

// website