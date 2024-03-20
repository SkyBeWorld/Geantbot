const { SlashCommandBuilder, CommandInteraction, PermissionFlagsBits, ChatInputCommandInteraction, Client, EmbedBuilder, ActionRowBuilder, ButtonBuilder, ButtonStyle } = require("discord.js") 
const { translation } = require("../../utils/translation")
const { OpenAI } = require("openai")
const config = require("../../../config.json")

module.exports = {
    data: new SlashCommandBuilder()
    .setName("ai")
    .setNameLocalizations({
        fr: "ia"
    })
    .setDescription("GeantbotAI based on GPT-4")
    .setDescriptionLocalizations({
        fr: "GeantbotIA basé sur GPT-4"
    })
    .addStringOption(option => option.setName("message").setDescription("message to send to the ai").setDescriptionLocalizations({fr: "Message a envoyé à l'ia"}).setRequired(true)),
    /**
     * @param {Client} client,
     * @param {CommandInteraction} interaction
     */
    async execute (interaction, client) {
        await interaction.deferReply()

        
        const msg = interaction.options.getString("message")

        const openai = new OpenAI({
            baseURL: config.openaiurl,
            apiKey: config.openai
        })

        const res = await openai.chat.completions.create({
            model: "gpt-3.5-turbo",
            messages: [
                {
                    role: "system",
                    content: "Chat GPT is a friendly chatbot"
                },
                {
                    role: "user",
                    content: msg
                }
            ]
        }).catch(err => console.log(err))

        await interaction.editReply({content: `${await res.choices[0].message.content}`})
    }
}