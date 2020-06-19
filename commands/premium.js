const {MessageEmbed} = require("discord.js");

exports.run = async(client, message, args) => {
    const embed = new MessageEmbed()
    .setColor(client.config.color)
    .setTitle(`Purchase Premium`)
    .setDescription(`To purchase premium, please click [here](${client.config.patreon_link})`)
    .setFooter(`Patreon Link`)
    .setTimestamp()
    message.channel.send(embed);
}