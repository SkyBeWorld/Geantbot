const { SlashCommandBuilder, CommandInteraction, PermissionFlagsBits, ChatInputCommandInteraction, Client, EmbedBuilder, ActionRowBuilder, ButtonBuilder, ButtonStyle, ComponentType } = require("discord.js")
const ms = require("ms") 
const { translation } = require("../../utils/translation")

module.exports = {
    data: new SlashCommandBuilder()
    .setName("unban")
    .setDescription("unban someone")
    .setDefaultMemberPermissions(PermissionFlagsBits.BanMembers)
    .addStringOption(option => option.setName("userid").setDescription("user to unban").setRequired(true)),
    /**
     * @param {Client} client,
     * @param {CommandInteraction} interaction
     */
    async execute (interaction, client) {
        const { guild, user } = interaction
        await interaction.deferReply({ephemeral: true})

        // options
        const member = interaction.options.getString("userid")

        // fetch
        if (isNaN(member)) return interaction.editReply({content: `${await translation("This user is not valid please provide a correct id", guild)}`})

        const BannedMembers = await guild.bans.fetch()
        if (!BannedMembers.find(x => x.user.id)) return interaction.editReply({content: `${await translation("This user is not banned!", guild)}`})

        // Buttons
        const row = new ActionRowBuilder().addComponents(
            new ButtonBuilder()
            .setStyle(ButtonStyle.Danger)
            .setCustomId("unban-yes")
            .setLabel(`${await translation("Yes", guild)}`),

            new ButtonBuilder()
            .setStyle(ButtonStyle.Secondary)
            .setCustomId("unban-no")
            .setLabel(`${await translation("No", guild)}`)
        )

        // Embed
        const Embed = new EmbedBuilder()
        .setColor("Random")
        .setFooter({text: `Geantbot - V3`})
        .setTimestamp()

        const Page = await interaction.editReply({
            embeds: [Embed.setDescription(`${await translation("⚠️**Do you really want to unban this member?**⚠️\nThis action is irreversible!", guild)}`).setTitle(`${await translation("⚠️unban request⚠️", guild)}`)],
            components: [row]
        })

        // collector
        const col = await Page.createMessageComponentCollector({
            componentType: ComponentType.Button,
            time: ms("1m") // 1 minute for press a button!
        })

        // if response
        col.on("collect", async (i) => {
            if (i.user.id !== user.id) return;

            switch (i.customId) {
                case "unban-yes":
                    await interaction.editReply({
                        embeds: [Embed.setDescription(`<@${member}> ${await translation(`has been unbanned from the server`, guild)}`).setTitle(`${await translation("unban accepted", guild)}`)],
                        components: []
                    })
                    
                    await guild.members.unban(member)
                    break;
                case "unban-no":
                    await interaction.editReply({
                        embeds: [Embed.setDescription(`${await translation("ban request cancelled", guild)}`).setTitle(`${await translation("unban request cancelled!", guild)}`)],
                        components: []
                    })
                    break;
                default:
                    break;
            }
        })

        // if didn't response
        col.on("end", async (i) => {
            if (i.size > 0) return

            await interaction.editReply({
                embeds: [Embed.setDescription(`${await translation("the unban request has been cancelled because you didn't provide a valid response in time!", guild)}`).setTitle(`${await translation("unban request cancelled!", guild)}`)],
                components: []
            })
        })
    }
}