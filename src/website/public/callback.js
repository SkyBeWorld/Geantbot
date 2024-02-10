const Client = require("../../index").Client
const oauth = require("../../index").oauth
const fs = require("fs")
const schema = require("../../Schemas/dashboard")
const jwt = require("jsonwebtoken")
const { jwt_secret } = require("../../../config.json")
const ms = require("ms")

module.exports = {
    name: "/callback",
    run: async (req, res) => {
        if (!req.query.code) res.redirect("/login")
        let oauthdata
        try {
            oauthdata = await oauth.tokenRequest({
                code: req.query.code,
                scope: "identify guilds",
                grantType: "authorization_code",
            })
        } catch(error) {
        }
        if (!oauthdata) return res.redirect("/login")
        let user
        try {
            user = await oauth.getUser(oauthdata.access_token)
        } catch(error) {
            return
        }
        let data
        try {
            data = await schema.findOne({
                userID: user.id
            })
        } catch(error) {
        }
        if (!data) data = new schema({
            userID: user.id
        })
        const id = data._id.toString()
        data.acces_token = oauthdata.access_token
        data.refresh_token = oauthdata.refresh_token
        data.expires_in = oauthdata.expires_in
        data.secretAccessKey = jwt.sign({
            userID: user.id,
            uuid: id
        }, jwt_secret)
        data.user = {
            id: user.id,
            username: user.username,
            discriminator: user.discriminator,
            avatar: user.avatar
        }
        await data.save()
        res.cookie("token", data.secretAccessKey, { maxAge: ms("30m") })
        res.end(`<script>window.location.href = '/dashboard';</script>`)
    }
}