module.exports = {
    name: "/logout",
    run: async (req, res) => {
        res.clearCookie("token")
        res.redirect("/")
    }
}