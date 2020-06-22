const embeds = require("../utils/embed");

exports.run = async(client, message, args) => {
    let guildData = await client.models.config.findById(message.guild.id);
    let options = ['channel', 'category'];
    
    if(args[0] === `channel`) {
        let channel = message.mentions.channels.first();

        if(!channel) return message.channel.send(embeds.error(`**Usage:** ${guildData.prefix}lock channel <#channel> [reason]`));
        channel.updateOverwrite(message.guild.id, { SEND_MESSAGES: false });

        if(guildData.lockbypass_roles) {
            guildData.lockbypass_roles.forEach(id => {
                channel.createOverwrite(id, { SEND_MESSAGES: true });
            });
        }

        if(guildData.lockbypass_users) {
            guildData.lockbypass_users.forEach(id => {
                channel.createOverwrite(id, { SEND_MESSAGES: true });
            });
        }

        message.channel.send(embeds.complete(`Successfuly locked the channel ${channel}.`));
    } else if(args[0] === `category`) {
        let id = args[1];
        if(!id) return message.channel.send(embeds.error(`**Usage:** ${guildData.prefix}lock category <category id> [reason]`));
        
        message.channel.send(embeds.complete(`Successfuly locked the channels under the category ID: **${id}**.`));
        message.guild.channels.cache.forEach(c => {
            if(c.parent && c.parent.id === id) {
                c.updateOverwrite(message.guild.id, { SEND_MESSAGES: false });

                if(guildData.lockbypass_roles) {
                    guildData.lockbypass_roles.forEach(role_id => {
                        c.updateOverwrite(role_id, { SEND_MESSAGES: true });
                    });
                }
        
                if(guildData.lockbypass_users) {
                    guildData.lockbypass_users.forEach(user_id => {
                        c.updateOverwrite(user_id, { SEND_MESSAGES: true });
                    });
                }
            }
        });
    }
}