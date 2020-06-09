const Discord = require("discord.js");
const embeds = require("../utils/embed");

exports.run = async(client, message, args) => {
    let updateChannel, logChannel, modLogs, lockBypass = ``;
    let guildData = await client.models.config.findById(message.guild.id);
    let options = [`lockbypass`, `updatechannel`, `logchannel`, `modlogs`];
    
    if(guildData.updatechannel === 'none') updateChannel = `None`
    else updateChannel = message.guild.channels.cache.get(guildData.updatechannel);

    if(guildData.logchannel === 'none') logChannel = `None`
    else logChannel = message.guild.channels.cache.get(guildData.logchannel);

    if(guildData.modlogs === 'none') modLogs = `None`
    else modLogs = message.guild.channels.cache.get(guildData.modlogs);

    if((guildData.lockbypass_roles.length + guildData.lockbypass_users.length) <= 0) lockBypass = `None`;
    if(guildData.lockbypass_roles.length > 0) guildData.lockbypass_roles.forEach(id => lockBypass += `<@&${id}>\n`);
    if(guildData.lockbypass_users.length > 0) guildData.lockbypass_users.forEach(id => lockBypass += `<@${id}>\n`);

    let channel = message.mentions.channels.first();
    
    if(options.includes(args[0])) {
        if(args[0] === `lockbypass`) {
            let member = message.mentions.members.first();
            let role = message.mentions.roles.first();

            if(member === `undefined` || role === `undefined`) return message.channel.send(embeds.error(`**Usage:** ${guildData.prefix}config lockbypass <@user/@role>`));

            if(role) {
                if(guildData.lockbypass_roles.includes(role.id)) {
                    let filter = guildData.lockbypass_roles.filter(x => x !== role.id);
                    guildData.lockbypass_roles = filter;
                    guildData.save();

                    message.channel.send(embeds.complete(`Role ${role} has been removed from the lock bypass.`));
                } else {
                    guildData.lockbypass_roles.push(role.id);
                    guildData.save();
                    
                    message.channel.send(embeds.complete(`Role ${role} has been added to the lock bypass.`));
                }
            } else {
                if(guildData.lockbypass_users.includes(member.id)) {
                    let filter = guildData.lockbypass_users.filter(x => x !== member.id);
                    guildData.lockbypass_users = filter;
                    guildData.save();

                    message.channel.send(embeds.complete(`Role ${member} has been removed from the lock bypass.`));
                } else {
                    guildData.lockbypass_users.push(member.id);
                    guildData.save();
                    
                    message.channel.send(embeds.complete(`Role ${member} has been added to the lock bypass.`));
                }
            }

        } else if(args[0] === `updatechannel`) {
            if(!channel) return message.channel.send(embeds.error(`**Usage:** ${guildData.prefix}config updatechannel <#channel>`));
            else {
                guildData.updatechannel = channel.id;
                guildData.save();
                
                message.channel.send(embeds.complete(`Changed the updates channel to ${channel}!`));
            }

        } else if(args[0] === `logchannel`) {
            if(!channel) return message.channel.send(embeds.error(`**Usage:** ${guildData.prefix}config logchannel <#channel>`));
            else {
                guildData.logchannel = channel.id;
                guildData.save();
                
                message.channel.send(embeds.complete(`Changed the logs channel to ${channel}!`));
            }
        } else if(args[0] === `modlogs`) {
            if(!channel) return message.channel.send(embeds.error(`**Usage:** ${guildData.prefix}config modlogs <#channel>`));
            else {
                guildData.modlogs = channel.id;
                guildData.save();
                
                message.channel.send(embeds.complete(`Changed the updates channel to ${channel}!`));
            }
        }
    } else {
        let currentConfig = new Discord.MessageEmbed()
        .setTitle(`Server Settings`)
        .setDescription(`Below are your current config settings.`)
        .addField(`Lock Bypass`, lockBypass)
        .addField(`Mog Logs`, modLogs)
        .addField(`Update Channel`, updateChannel)
        .addField(`Log Channel`, logChannel)
        .setFooter(client.config.name)
        .setTimestamp()
        .setColor(client.config.color)
        message.channel.send(currentConfig);
    }
}