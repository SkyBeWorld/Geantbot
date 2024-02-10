const { model, Schema } = require('mongoose')

module.exports = model("dashboard", new Schema({
    userID: String,
    acces_token: String,
    refresh_token: String,
    expires_in: Number,
    secretAccessKey: String,
    user: {
        id: String,
        username: String,
        discriminator: String,
        avatar: String
    },
    lastUpdate: {
        type: Number,
        default: Date.now()
    }
}))