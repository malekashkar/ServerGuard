const embeds = require("../utils/embed");

exports.run = async(client, message, args) => {
    let guildData = await client.models.config.findById(message.guild.id);
    let options = ['channel', 'category'];
    
    if(args[0] === options[0]) {
        let channel = message.mentions.channels.first();
        if(!channel) return message.channel.send(embeds.error(`**Usage:** ${guildData.prefix}unlock channel <#channel> [reason]`));

        channel.updateOverwrite(message.guild.id, { VIEW_CHANNEL: null, SEND_MESSAGES: null });
        message.channel.send(embeds.complete(`Successfuly unlocked the channel ${channel}.`));
    } else if(args[0] === options[1]) {``
        let id = args[1];
        if(!id) return message.channel.send(embeds.error(`**Usage:** ${guildData.prefix}unlock category <category id> [reason]`));
        
        message.channel.send(embeds.complete(`Successfuly unlocked the channels under the category ID: **${id}**.`));
        message.guild.channels.cache.forEach(c => {
            if(c.parent && c.type === "text" && c.parent.id === id) c.updateOverwrite(message.guild.id, { VIEW_CHANNEL: null, SEND_MESSAGES: null })
        });
    }
}