const { SlashCommandBuilder, CommandInteraction, PermissionFlagsBits, ChatInputCommandInteraction, Client, EmbedBuilder, ActionRowBuilder, ButtonBuilder, ButtonStyle, ModalBuilder, TextInputBuilder, TextInputStyle, Events, Embed } = require("discord.js") 
const { translation } = require("../../utils/translation")
const release = require("../../Schemas/releasenotes")

module.exports = {
    data: new SlashCommandBuilder()
    .setName("change-logs")
    .setDescription("get release notes")
    .setDescriptionLocalizations({
        fr: "avoir les notes de sortie"
    })
    .addSubcommand(subcommand => subcommand.setName("publish").setDescription("publish a new realease (dev only)"))
    .addSubcommand(subcommand => subcommand.setName("view").setNameLocalizations({fr: "voir"}).setDescription("view the realease notes").setDescriptionLocalizations({fr: "Voir la note de sortie"})),
    /**
     * @param {Client} client,
     * @param {CommandInteraction} interaction
     */
    async execute (interaction, client) {
        const { guild } = interaction
        const sub = interaction.options.getSubcommand()
        var data = await release.find()


        switch (sub) {
            case "publish":
                if (interaction.user.id !== "689466766916714532") {
                    await interaction.reply({content: `${await translation(`You can use this command!`, guild)}`, ephemeral: true})
                } else {
                    const modal = new ModalBuilder()
                    .setTitle("Create an update")
                    .setCustomId("update-modal")


                    const row = new ActionRowBuilder().addComponents(
                        new TextInputBuilder()
                        .setCustomId("version")
                        .setLabel("Version")
                        .setStyle(TextInputStyle.Short)
                        .setRequired(true),
                    )

                    const row1 = new ActionRowBuilder().addComponents(
                        new TextInputBuilder()
                        .setCustomId("notes")
                        .setLabel("Notes")
                        .setStyle(TextInputStyle.Paragraph)
                        .setRequired(true),
                    )

                    modal.addComponents(row, row1)

                    await interaction.showModal(modal)

                    client.on(Events.InteractionCreate, async (e) => {
                        if (e.isModalSubmit()) {
                            if (e.customId === "update-modal") {
                                const update = e.fields.getTextInputValue("notes")
                                const ver = e.fields.getTextInputValue("version")

                                if (data.length > 0) {
                                    await release.deleteMany();

                                    var version = ver
                                    await data.forEach(async v => {
                                        version = ver
                                    })

                                    await release.create({
                                        Updates: update,
                                        Date: Date.now(),
                                        Developer: e.user.username,
                                        Version: version
                                    })

                                    await e.reply({content: `Updated with successfully`, ephemeral: true})
                                } else {
                                    await release.create({
                                        Updates: update,
                                        Date: Date.now(),
                                        Developer: e.user.username,
                                        Version: ver
                                    })

                                    await e.reply({content: `Updated with successfully`, ephemeral: true})
                                }
                            }
                        }
                    })
                }
                break;
            case "view":
                await interaction.deferReply({ephemeral: true})
                if (data.length == 0) {
                    await interaction.editReply({content: `${await translation("There no release note", guild)}`})
                } else {
                    var string = ``
                    await data.forEach(async v => {

                        const embed = new EmbedBuilder()
                        .setTitle("Release notes")
                        .setDescription(`${await translation(`Version: ${v.Version}\n- **Update information**:\n\`\`\`${v.Updates}\`\`\`\n\n- **Published by**: ${v.Developer}\n- **Published time**: <t:${Math.floor(v.Date / 1000)}:R>`, guild)}`)
                        .setColor("Random")

                        await interaction.editReply({embeds: [embed]})
                    })
                }
                break;
            default:
                break;
        }
    }
}