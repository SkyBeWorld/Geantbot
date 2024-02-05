const translate = require("@iamtraction/google-translate")
const GuildSchema = require("../Schemas/GuildSettings")

async function translation(text, guild) {
    const data = await GuildSchema.findOne({ GuildId: guild.id })
    let lang
    if (!data) {
        const translatedEnglish = await translate(text, { from: 'english', to: 'english' })
        return translatedEnglish.text
    } else {
        lang = data.language
        const translated = await translate(text, { from: 'english', to: lang })
        return translated.text
    }
}

async function Translate(text, from, to) {
    const translated = await translate(text, { from, to })
    return translated.text
}

async function FindGuildLanguages(guild) {
    const data = await GuildSchema.findOne({ GuildId: guild.id })
    return data.language
}

module.exports = { translation, Translate, FindGuildLanguages }