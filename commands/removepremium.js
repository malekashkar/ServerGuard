const embeds = require("../utils/embed");

exports.run = async(client, message, args) => {
    if(message.guild.id !== client.config.main_guild) return;

    let member = message.mentions.members.first();
    let guildData = await client.models.config.findById(message.guild.id);
    if(!member) return message.channel.send(embeds.error(`**Usage:** ${guildData.prefix}removepremium <@user>`));
    if(!member.roles.cache.has(client.config.premium_role)) return message.channel.send(embeds.error(`${member} does not currently have premium!`));
    
    member.roles.remove(client.config.premium_role);
    message.channel.send(embeds.complete(`Successfuly taken away premium role from ${member}.`));
}