const embeds = require("../utils/embed");

exports.run = async(client, message, args) => {
    let guildData = await client.models.config.findById(message.guild.id);
    let limit = args[0];
    
    console.log(Number.isInteger(Number(limit)))

    if(!Number.isInteger(parseInt(args[0])) && args[0] !== "off") return message.channel.send(embeds.error(`**Usage:** ${guildData.prefix}slowmode <time/off>`));

    if(Number.isInteger(Number(limit))) message.channel.setRateLimitPerUser(Number(limit));
    else message.channel.setRateLimitPerUser(0);

    message.channel.send(embeds.complete(`Slowmode in channel ${message.channel} set to: **${Number.isInteger(Number(limit)) ? Number(limit) : `off`}**`));
}