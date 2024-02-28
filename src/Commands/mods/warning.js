const { SlashCommandBuilder, CommandInteraction, PermissionFlagsBits, ChatInputCommandInteraction, Client, EmbedBuilder, ActionRowBuilder, ButtonBuilder, ButtonStyle, ModalBuilder, TextInputBuilder, TextInputStyle, Events } = require("discord.js") 
const { translation } = require("../../utils/translation")
const warnSchema = require("../../Schemas/warningSchema")

module.exports = {
    data: new SlashCommandBuilder()
    .setName("warnings")
    .setNameLocalizations({
        fr: "avertissement"
    })
    .setDescription("warning someone")
    .setDescriptionLocalizations({
        fr: "avertir quelqu'un"
    })
    .setDefaultMemberPermissions(PermissionFlagsBits.ModerateMembers)
    .addSubcommand(subcommand =>
        subcommand.setName("add").setNameLocalizations({fr: "ajouter"})
        .setDescription("Add warning on someone").setDescriptionLocalizations({fr: "vérifier un avertissement a quelqu'un"})
        .addUserOption(option => option.setName("user").setNameLocalizations({fr: "utilisateur"}).setDescription("user to warn").setDescriptionLocalizations({fr: "l'utilisateur a avertir"}).setRequired(true))
    )
    .addSubcommand(subcommand =>
        subcommand.setName("check").setNameLocalizations({fr: "vérifier"})
        .setDescription("Check warnings of someone").setDescriptionLocalizations({fr: "Vérifier les avertissements de quelqu'un"})
        .addUserOption(option => option.setName("user").setNameLocalizations({fr: "utilisateur"}).setDescription("user to check").setDescriptionLocalizations({fr: "l'utilisateur a vérifier"}).setRequired(true))
    )
    .addSubcommand(subcommand =>
        subcommand.setName("remove").setNameLocalizations({fr: "supprimer"})
        .setDescription("remove warning of someone").setDescriptionLocalizations({fr: "supprimer l'avertissements de quelqu'un"})
        .addUserOption(option => option.setName("user").setNameLocalizations({fr: "utilisateur"}).setDescription("user to remove").setDescriptionLocalizations({fr: "l'utilisateur a supprimer"}).setRequired(true))
        .addStringOption(option => option.setName("warnid").setDescription("warn id for the member").setDescriptionLocalizations({fr: "l'id de l'avertissement du membre"}).setRequired(true))
    ),
    /**
     * @param {Client} client,
     * @param {CommandInteraction} interaction
     */
    async execute (interaction, client) {
        const { guild } = interaction
        const sub = interaction.options.getSubcommand()
        const date = new Date(interaction.createdTimestamp).toLocaleDateString()
        const user = interaction.options.getUser("user")
        const warnId = interaction.options.getString("warnid") - 1

        const data = await warnSchema.findOne({GuildID: guild.id, userid: user.id}).catch(err => {  })

        switch (sub) {
            case "add":
                const modal = new ModalBuilder()
                .setTitle(`${await translation(`Add warn to ${user.username}`, guild)}`)
                .setCustomId("warn-add")
                
                const text = new ActionRowBuilder().addComponents(
                    new TextInputBuilder()
                    .setCustomId("warn-reason")
                    .setLabel(`${await translation("reason", guild)}`)
                    .setStyle(TextInputStyle.Paragraph)
                    .setRequired(true)
                )

                modal.addComponents(text)

                await interaction.showModal(modal)

                client.on(Events.InteractionCreate, async (e) => {
                    
                    if (e.isModalSubmit) {
                        if (e.customId === "warn-add") {
                            const reason = e.fields.getTextInputValue("warn-reason")
                            if (!data) {
                                warnSchema.create({
                                    GuildID: guild.id,
                                    userid: user.id,
                                    Content: [
                                        {
                                            ModeratorId: interaction.user.id,
                                            Reason: reason,
                                            Date: date
                                        }
                                    ]
                                })
                            } else {
                                const warnContent = {
                                    ModeratorId: interaction.user.id,
                                    Reason: reason,
                                    Date: date
                                }
                                data.Content.push(warnContent)

                                await data.save()
                            }
                            
                            const embed = new EmbedBuilder()
                            .setTitle(`${await translation(`added warning to ${user.username}`, guild)}`)
                            .setColor("Green")
                            .setDescription(`${await translation(`Warning added to ${user}\n\n\n- Reason: ${reason}`, guild)}`)
                            .setFooter({text: `Made by SkyBeWorld`})
                            .setTimestamp()

                            await e.reply({embeds: [embed], ephemeral: true})
                        }
                    }
                })
                break;
            case "check":
                await interaction.deferReply()
                if (data) {
                    const embed = new EmbedBuilder()
                    .setTitle(`${await translation(`Warnings of ${user.username}`, guild)}`)
                    .setDescription(`${data.Content.map((w, i) => `- **ID**: ${i + 1}\n- **By**: <@${w.ModeratorId}>\n- **Date**: ${w.Date}\n- **Reason**: ${w.Reason}\n\n\n`).join(" ")}`)
                    .setFooter({text: `Made by SkyBeWorld`})
                    .setTimestamp()

                    await interaction.editReply({embeds: [embed]})
                } else {
                    const embed = new EmbedBuilder()
                    .setTitle(`${await translation("Unable to find", guild)}`)
                    .setDescription(`${await translation(`Unable to find <@${user.id}> in the database`, guild)}`)
                    .setFooter({text: `Made by SkyBeWorld`})
                    .setTimestamp()

                    await interaction.editReply({embeds: [embed]})
                }
                break;
            case "remove":
                await interaction.deferReply({ephemeral: true})
                if (data) {
                    data.Content.splice(warnId, 1)
                    data.save()

                    const embed = new EmbedBuilder()
                    .setTitle(`${await translation(`Deleted 1 warn of ${user.username}`, guild)}`)
                    .setDescription(`${await translation(`I deleted the warning with the id ${warnId + 1} of the member ${user}`, guild)}`)
                    .setFooter({text: `Made by SkyBeWorld`})
                    .setTimestamp()

                    await interaction.editReply({embeds: [embed]})
                } else {
                    const embed = new EmbedBuilder()
                    .setTitle(`${await translation("Unable to find", guild)}`)
                    .setDescription(`${await translation(`Unable to find <@${user.id}> in the database`, guild)}`)
                    .setFooter({text: `Made by SkyBeWorld`})
                    .setTimestamp()

                    await interaction.editReply({embeds: [embed]})
                }
                break;
            default:
                break;
        }
    }
}