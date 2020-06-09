const embeds = require("../utils/embed");

exports.run = async(client, message, args) => {
    let guildData = await client.models.config.findById(message.guild.id);

    let invite = args[0];
    if(!invite) return message.channel.send(embeds.error(`**Usage:** ${guildData.prefix}`))
    client.fetchInvite()
}