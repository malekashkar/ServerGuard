const embeds = require("../utils/embed");
const ms = require("ms");

exports.run = async(client, message, args) => {
    let guildData = await client.models.config.findById(message.guild.id);

    let count = args[3];
    let user = message.mentions.members.first();
    let channel = message.mentions.channels.first();
    
    if(!channel && !user && ![`message`, `links`].includes(args[0])) return message.channel.send(embeds.error(`**Usage:** ${guildData.prefix}purge <@user> <#channel> [amount]`));
    
    if(args[0] === `message`) {
        let limit = parseInt(count);
        if(!count) limit = 100;

        let msgs = await channel.messages.fetch({ limit: limit });
        let ones = msgs.filter(m => m.author.id === user.id);
        ones.forEach(m => m.delete());
    } else if(args[0] === `links`) {
        let limit = parseInt(count);
        if(!count) limit = 100;

        let msgs = await channel.messages.fetch({ limit: limit });
        let ones = msgs.filter(m => m.author.id === user.id && m.content.match(/http|https/gm));
        ones.forEach(m => m.delete());
    }
}