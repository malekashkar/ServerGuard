const embeds = require("../utils/embed");

exports.run = async(client, message, args) => {
    if(message.guild.id !== client.config.main_guild) return;

    let member = message.mentions.members.first();
    let guildData = await client.models.config.findById(message.guild.id);
    if(!member) return message.channel.send(embeds.error(`**Usage:** ${guildData.prefix}givepremium <@user>`));
    
    member.roles.add(client.config.premium_role);
    message.channel.send(embeds.complete(`Successfuly given premium role to ${member}.`));
}