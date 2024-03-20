const Client = require("../../index").Client
const { PermissionsBitField } = require("discord.js")
const fs = require("fs")
const jwt = require("jsonwebtoken")
const { jwt_secret, apidomain, apilocal } = require("../../../config.json")
const schema = require("../../Schemas/dashboard")
const oauth = require("../../index").oauth

module.exports = {
    name: "/server/:id/config",
    run: async(req, res) => {
        let { guild, member, data } = await verify(req, res)


        const bitPermissions = new PermissionsBitField(member.permissions.bitfield)
        if (!member.permissions.has(PermissionsBitField.Flags.ManageGuild) && !member.permissions.has(PermissionsBitField.Flags.Administrator) && Client.guilds.cache.get(guild.id).ownerId == data.userID) return res.redirect("/dashboard")

        let args = {
            avatar: `https://cdn.discordapp.com/avatars/${data.userID}/${data.user.avatar}.png`,
            username: data.user.username,
            id: data.user.id,
            guild: guild,
            updated: false,
            error: false
        }

        res.render("./website/html/config.ejs", args)
    }
}

async function verify(req, res) {
    delete require.cache[require.resolve("../html/dashboard.ejs")]

    if (!req.params.id || !Client.guilds.cache.has(req.params.id)) return res.redirect("/dashboard")

    if (!req.cookies.token) return res.redirect("/login")

    let decoded
    try {
        decoded = jwt.verify(req.cookies.token, jwt_secret)
    } catch (error) {

    }
    if (!decoded) res.redirect("/login")

    let data = await schema.findOne({
        _id: decoded.uuid,
        userID: decoded.userID
    })
    if (!data) res.redirect("/login")

    const guild = Client.guilds.cache.get(req.params.id)
    if (!guild) return res.redirect("/dashboard")
    const member = await guild.members.fetch(data.userID)
    if (!member) return res.redirect("/dashboard")

    return {
        guild: guild,
        member: member,
        data: data
    }
}