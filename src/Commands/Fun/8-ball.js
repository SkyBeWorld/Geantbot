const { SlashCommandBuilder, CommandInteraction, PermissionFlagsBits, ChatInputCommandInteraction, Client, EmbedBuilder, ActionRowBuilder, ButtonBuilder, ButtonStyle, Embed, transformResolved } = require("discord.js") 
const { translation } = require("../../utils/translation")

module.exports = {
    data: new SlashCommandBuilder()
    .setName("8-ball")
    .setDescription("get a random response of the bot.")
    .setDescriptionLocalizations({
        fr: "avoir une réponse aléatoire du bot"
    })
    .addStringOption(option => option.setName("question").setNameLocalizations({fr: "question"}).setDescription("question to ask").setDescriptionLocalizations({fr: "question a poser"}).setRequired(true)),
    /**
     * @param {Client} client,
     * @param {CommandInteraction} interaction
     */
    async execute (interaction, client) {
        await interaction.deferReply()
        const { guild } = interaction
        const question = interaction.options.getString("question")
        const choices = ["🎱| It is certian.", "🎱| It is decidedly so.", "🎱| Without a doubt.", "🎱| Yes definitely.", "🎱| You may rely on it.", "🎱| As I see it, yes.", "🎱| Most likely.", "🎱| Outlook good.", "🎱| Yes.", "🎱| Signs point to yes.", "🎱| Reply hazy, try again.", "🎱| Ask again later.", "🎱| Better not tell you now.", "🎱| Cannot predict now.", "🎱| Concentrate and ask again.", "🎱| Don't count on it.", "🎱| My reply is no.", "🎱| My sources say no.", "🎱| Outlook not so good.", "🎱| Very doubtful."]
        const ball = Math.floor(Math.random() * choices.length)

        const embed = new EmbedBuilder()
        .setTitle(`${await translation(`🎱 | ${interaction.user.username}'s 8ball game`, guild)}`)
        .addFields(
            {
                name: `${await translation("Question", guild)}`,
                value: `${question}`,
                inline: true
            }
        )
        .setColor("Random")

        const embed2 = new EmbedBuilder()
        .setTitle(`${await translation(`🎱 | ${interaction.user.username}'s 8ball game`, guild)}`)
        .addFields(
            {
                name: `${await translation("Question", guild)}`,
                value: `${question}`,
                inline: true
            }
        )  
        .addFields(
            {
                name: `${await translation("Answer", guild)}`,
                value: `${await translation(`${choices[ball]}`, guild)}`,
                inline: true
            }
        )     
        .setColor("Random")  

        const button = new ActionRowBuilder().addComponents(
            new ButtonBuilder()
            .setCustomId("roll-8ball")
            .setLabel(`${await translation("🎱 Roll the ball", guild)}`)
            .setStyle(ButtonStyle.Success)
        )

        const msg = await interaction.editReply({embeds: [embed], components: [button]})

        const col = msg.createMessageComponentCollector()

        col.on("collect", async i => {
            if (i.customId == "roll-8ball") {
                i.update({embeds: [embed2], components: []})
            }
        })
    }
}