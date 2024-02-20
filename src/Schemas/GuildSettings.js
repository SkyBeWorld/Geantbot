const { model, Schema } = require('mongoose')

module.exports = model("GuildSetting", new Schema({
    GuildId: {
        type: String,
        required: true
    },
    BLW: {
        type: Array,
        default: []
    },
    language: {
        type: String
    },
    WelcomeChannel: {
        type: String
    },
    WelcomeMessage: {
        type: String
    },
    GoodbyeChannel : {
        type: String
    },
    GoodbyeMessage: {
        type: String
    }
}))