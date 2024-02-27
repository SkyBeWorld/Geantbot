const { model, Schema } = require('mongoose')

module.exports = model("warning", new Schema({
    GuildID: String,
    userid: String,
    Content: Array
}))