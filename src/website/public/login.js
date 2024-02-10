const oauth = require("../../index").oauth
const jwt = require("jsonwebtoken")
const { jwt_secret } = require("../../../config.json")
const schema = require("../../Schemas/dashboard")

module.exports = {
    name: "/login",
    run: async (req, res) => {
        const url = oauth.generateAuthUrl({
            scope: ["identify", "guilds"],
            state: require("node:crypto").randomBytes(16).toString("hex")
        })
        if (req.cookies.token && req.cookies.token.length > 0) {
            let decoded
            try {
                decoded = jwt.verify(req.cookies.token, jwt_secret)
            } catch (error) {
                return res.redirect("/login")
            }
            if (!decoded) return res.redirect("/login")
            let data = await schema.findOne({
                _id: decoded.uuid,
                userID: decoded.userID
            })
            if (!data) res.redirect(url)
            else {
                if ((Date.now() - data.lastUpdate) > data.expires_in * 1000) {
                    const oauthData = oauth.tokenRequest({
                        refreshToken: data.refresh_token,
                        grantType: "refresh_token",
                        scope: ["identify", "guilds"],
                    })
                    data.acces_token = oauthData.access_token
                    data.refresh_token = oauthData.refresh_token
                    data.expires_in = oauthData.expires_in
                }
                await data.save()
                res.redirect("/dashboard")
            }
        } else res.redirect(url)
    }
}