const { model, Schema } = require('mongoose')

module.exports = model("updates", new Schema({
    Updates: String,
    Date: String,
    Developer: String,
    Version: String
}))