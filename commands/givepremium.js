const embeds = require("../utils/embed");

exports.run = async(client, message, args) => {
    if(message.guild.id !== client.config.main_guild) return;

    let member = message.mentions.members.first();
    let role = message.guild.roles.cache.get(client.config.premium_role);
    let guildData = await client.models.config.findById(message.guild.id);
    if(!member) return message.channel.send(embeds.error(`**Usage:** ${guildData.prefix}givepremium <@user>`));
    
    member.roles.add(role);
    message.channel.send(embeds.complete(`Successfuly given premium role to ${member}.`));
}