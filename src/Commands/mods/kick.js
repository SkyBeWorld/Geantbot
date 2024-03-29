const { SlashCommandBuilder, CommandInteraction, PermissionFlagsBits, ChatInputCommandInteraction, Client, EmbedBuilder, ActionRowBuilder, ButtonBuilder, ButtonStyle, ComponentType } = require("discord.js")
const ms = require("ms") 
const { translation } = require("../../utils/translation")

module.exports = {
    data: new SlashCommandBuilder()
    .setName("kick")
    .setNameLocalizations({
        fr: "expulser"
    })
    .setDescription("kick someone")
    .setDescriptionLocalizations({
        fr: "expulser quelqu'un"
    })
    .setDefaultMemberPermissions(PermissionFlagsBits.KickMembers)
    .addUserOption(option => 
        option.setName("user")
        .setNameLocalizations({
            fr: "utilisateur"
        })
        .setDescription("user to kick")
        .setDescriptionLocalizations({
            fr: "l'utilisateur a expulser"
        })
        .setRequired(true))
    .addStringOption(option => 
        option.setName("reason")
        .setNameLocalizations({
            fr: "raison"
        })
        .setDescription("the reason of the kick")
        .setDescriptionLocalizations({
            fr: "la raison de le expultion"
        })
        .setRequired(false)),
    /**
     * @param {Client} client,
     * @param {CommandInteraction} interaction
     */
    async execute (interaction, client) {
        const { guild, user } = interaction
        await interaction.deferReply({ephemeral: true})

        // options
        const member = interaction.options.getMember("user")
        const reason = interaction.options.getString("reason") || "No reason provided"

        //perms
        if (member.id === user.id) return interaction.editReply({content: `${await translation("You can't kick yourself!", guild)}`})
        if (guild.ownerId === member.id) return interaction.editReply({content: `${await translation("You can't kick the server owner!", guild)}`})
        if (guild.members.me.roles.highest.position <= member.roles.highest.position) return interaction.editReply({content: `${await translation("You can't kick a member of your same level or highest!", guild)}`})
        if (interaction.member.roles.highest.position <= member.roles.highest.position) return interaction.editReply({content: `${await translation("I can't kick a member of my same level or highest!", guild)}`})

        // Buttons
        const row = new ActionRowBuilder().addComponents(
            new ButtonBuilder()
            .setStyle(ButtonStyle.Danger)
            .setCustomId("kick-yes")
            .setLabel(`${await translation("Yes", guild)}`),

            new ButtonBuilder()
            .setStyle(ButtonStyle.Secondary)
            .setCustomId("kick-no")
            .setLabel(`${await translation("No", guild)}`)
        )

        // Embed
        const Embed = new EmbedBuilder()
        .setColor("Random")
        .setFooter({text: `Geantbot - V3`})
        .setTimestamp()

        const Page = await interaction.editReply({
            embeds: [Embed.setDescription(`${await translation("⚠️**Do you really want to kick this member?**⚠️\nThis action is irreversible!", guild)}`).setTitle(`${await translation("⚠️Kick request⚠️", guild)}`)],
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
                case "kick-yes":
                    await member.send({content: `${await translation(`You have been kicked from `, guild)} ${guild.name}\n${await translation("for the reason:", guild)} ${reason}`}).catch(err => {
                        if (err.code !== 50007) return console.log(err)
                    })


                    await interaction.editReply({
                        embeds: [Embed.setDescription(`${member} ${await translation(`has been kicked from the server for:`, guild)} **${reason}**`).setTitle(`${await translation("Kick accepted", guild)}`)],
                        components: []
                    })

                    await interaction.channel.send({content: `${interaction.user} kicked ${member.displayName}`})
                    
                    await member.kick({reason})
                    break;
                case "kick-no":
                    await interaction.editReply({
                        embeds: [Embed.setDescription(`${await translation("kick request cancelled", guild)}`).setTitle(`${await translation("Kick request cancelled!", guild)}`)],
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
                embeds: [Embed.setDescription(`${await translation("the kick request has been cancelled because you didn't provide a valid response in time!", guild)}`).setTitle(`${await translation("Kick request cancelled!", guild)}`)],
                components: []
            })
        })
    }
}