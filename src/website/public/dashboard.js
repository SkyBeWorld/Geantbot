const Client = require("../../index").Client
const { PermissionsBitField } = require("discord.js")
const fs = require("fs")
const jwt = require("jsonwebtoken")
const { jwt_secret, apidomain, apilocal } = require("../../../config.json")
const schema = require("../../Schemas/dashboard")
const oauth = require("../../index").oauth

module.exports = {
    name: "/dashboard",
    run: async (req, res) => {
        delete require.cache[require.resolve("../html/dashboard.ejs")]

        if (!req.cookies.token) return res.redirect("/login")
        let decoded
        try {
            decoded = jwt.verify(req.cookies.token, jwt_secret)
        } catch (error) {
            
        }

        if (decoded) {
            let data = await schema.findOne({
                _id: decoded.uuid,
                userID: decoded.userID
            })


            // pour les guild
            if (!req.cookies.token) return res.redirect("/login")
            if (!decoded) res.redirect("/login")

            if (!data) res.redirect("/login")
            let guildArray;
            try {
                guildArray = await oauth.getUserGuilds(data.acces_token)
            } catch(e) {
                console.error(e);
            }
            let mutualArray = []
            guildArray.forEach(g => {
                if (!g.icon) {
                    g.avatar = `/assets/no-server.png`
                } else {
                    g.avatar = `https://cdn.discordapp.com/icons/${g.id}/${g.icon}.png`
                }
                if (Client.guilds.cache.get(g.id)) {
                    const bitPermissions = new PermissionsBitField(g.permissions)
                    if (bitPermissions.has(PermissionsBitField.Flags.ManageGuild) || bitPermissions.has(PermissionsBitField.Flags.Administrator) || Client.guilds.cache.get(g.id).ownerId == data.userID) g.hasPerm = true
                    mutualArray.push(g)
                } else g.hasPerm = false
            })

            let avatar = null

            if (data.user.avatar === null) {
                avatar = "/assets/no-server.png"
            } else {
                avatar = `https://cdn.discordapp.com/avatars/${data.userID}/${data.user.avatar}.png`
            }


            let args = {
                avatar: avatar,
                username: data.user.username,
                id: data.userID,
                loggedin: true,
                guilds: guildArray,
                adminGuilds: mutualArray,
            }

            res.render("./website/html/dashboard.ejs", args)
        } else res.redirect("/login")
    }
}