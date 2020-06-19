const {MessageEmbed} = require("discord.js");

exports.run = async(client, message, args) => {
    const embed = new MessageEmbed()
    .setColor(client.config.color)
    .setTitle(`Receive Support`)
    .setDescription(`To receive help from staff, please click [here](${client.config.discord_invite})`)
    .setFooter(`Discord Server Link`)
    .setTimestamp()
    message.channel.send(embed);
}