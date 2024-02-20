const Client = require("../../index").Client
const fs = require("fs")

module.exports = {
    name: "/",
    run: async(req, res) => {
        delete require.cache[require.resolve("../html/home.ejs")]

        let args = {
            guilds: Client.guilds.cache.size
        }

        res.render("./website/html/home.ejs", args)
    }
}