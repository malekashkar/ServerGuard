const embeds = require("../utils/embed");

exports.run = async(client, message, args) => {
    let guildData = await client.models.config.findById(message.guild.id);
    let limit = args[0];
    
    if(!isNaN(parseInt(args[0])) || args[0] !== "off") return message.channel.send(embeds.error(`**Usage:** ${guildData.prefix}slowmode <time/off>`));

    if(!isNaN(parseInt(limit))) message.channel.setRateLimitPerUser(parseInt(limit));
    else if(limit === "off") message.channel.setRateLimitPerUser(0);

    let option;
    if(!isNaN(parseInt(limit))) option = `${limit}s`;
    else if(limit === "off") option = `off`

    message.channel.send(embeds.complete(`Slowmode in channel ${message.channel} set to: **${option}**`));
}