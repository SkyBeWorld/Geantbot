const { Client, Partials, Collection } = require("discord.js")
const { Channel, GuildMember, Message, Reaction, ThreadMember, User, GuildScheduledEvent } = Partials
const express = require("express")
const app = express()
const loadCommands = require("./Handlers/CommandsHandler")
const loadEvents = require("./Handlers/EventsHandler")
const cookieParser = require("cookie-parser")
const urlencodedParser = require("body-parser").urlencoded({ extended: false })
const DiscordOauth2 = require("discord-oauth2")
const config = require("../config.json")
const fs = require("fs")
const ascii = require("ascii-table")
require("dotenv").config()
const process = require("node:process")
const { Agent } = require("undici")

process.on("unhandledRejection", async (r, p) => {
    console.log(p, r)
})

process.on("uncaughtException", async (r) => {
    console.log(r)
})

process.on("uncaughtExceptionMonitor", async (r, o) => {
    console.log(r, o)
})

// discord client

const client = new Client({
    intents: 131071,
    partials: [Channel, GuildMember, Message, Reaction, ThreadMember, User, GuildScheduledEvent]
})
const agent = new Agent({
    connect: {
        timeout: 10_000
    }
})

client.rest.setAgent(agent)

client.login(process.env.token).then(async (e) => {
    loadEvents(client)
    loadCommands(client)
}).catch(async (err) => {
    console.log("[ERROR]: " + err)
})

// express

app.enable("trust proxy")
app.set("etag", false)
app.use(express.static(__dirname + "/website"))
app.set("views", `${__dirname}`)
app.set("view engine", "ejs")
app.use(cookieParser())
app.use(urlencodedParser)
app.use(express.json())

// Oauth2

const oauth = new DiscordOauth2({
    clientId: config.clientID,
    clientSecret: config.clientSecret,
    redirectUri: `${config.domain}/callback`
})
module.exports.oauth = oauth

// collections

client.commands = new Collection()
module.exports.Client = client

// website

let files = fs.readdirSync("./src/website/public").filter(f => f.endsWith(".js"))
const table = new ascii().setHeading("Website", "Status")
files.forEach(f => {
    const file = require(`../src/website/public/${f}`)
    if (file && file.name) {
        app.get(file.name, file.run)

        if (file.run2) app.post(file.name, file.run2)
        table.addRow(file.name, "Loaded")
    }

})
console.log(table.toString())

app.listen(config.port, () => console.log(`app listen at port : ${config.port}`))

app.get('*', (req, res) => {
  res.sendFile(__dirname + "/website/html/404.html")
})