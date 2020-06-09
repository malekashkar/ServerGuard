const embeds = require("../utils/embed");

exports.run = async(client, message, args) => {
    let guildData = await client.models.config.findById(message.guild.id);
    let options = ['channel', 'category'];
    
    if(args[0] === options[0]) {
        let channel = message.mentions.channels.first();
        let reason = args.splice(2).join(" ");
        if(!reason) reason = `None`;

        if(!channel) return message.channel.send(embeds.error(`**Usage:** ${guildData.prefix}unlock channel <#channel> [reason]`));
        channel.updateOverwrite(message.guild.id, { VIEW_CHANNEL: true, SEND_MESSAGES: true });

        message.channel.send(embeds.complete(`Successfuly unlocked the channel ${channel}.`));
    } else if(args[0] === options[1]) {
        let id = args[1];
        if(!id) return message.channel.send(embeds.error(`**Usage:** ${guildData.prefix}unlock category <category id> [reason]`));
        
        let reason = args.splice(2).join(" ");
        if(!reason) reason = `None`;

        message.channel.send(embeds.complete(`Successfuly unlocked the channels under the category ID: **${id}**.`));
        message.guild.channels.cache.forEach(c => {
            if(c.parent && c.parent.id === id) c.updateOverwrite(message.guild.id, { VIEW_CHANNEL: true, SEND_MESSAGES: true })
        });
    }
}