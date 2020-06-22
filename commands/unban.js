const embeds = require("../utils/embed");

exports.run = async(client, message, args) => {
    let reason = args.splice(1).join(" ");
    let guildData = await client.models.config.findById(message.guild.id);
    
    if(!args[0]) return message.channel.send(embeds.error(`**Usage:** ${guildData.prefix}unban <tag/id>`));

    let bans = await message.guild.fetchBans();

    if(args[0].includes("#")) {
        bans.forEach(b => {
            if(b.user.username === args[0].split("#")[0] && b.user.discriminator === args[0].split("#")[1]) {
                message.channel.send(embeds.complete(`Successfully unbanned <${b.user.id}> from the server.`));
                if(guildData.modlogs !== `none`) message.guild.channels.cache.get(guildData.modlogs).send(embeds.log(`Successfully unbanned <@${b.user.id}> from the server${reason ? ` because of **${reason}**` : ``}.`, `unban`));
                message.guild.members.unban(b.user.id, reason);
            }
        });
    } else {
        bans.forEach(b => {
            if(b.user.id === args[0]) {
                message.channel.send(embeds.complete(`Successfully unbanned <@${b.user.id}> from the server.`));
                if(guildData.modlogs !== `none`) message.guild.channels.cache.get(guildData.modlogs).send(embeds.log(`Successfully unbanned <@${b.user.id}> from the server${reason ? ` because of **${reason}**` : ``}.`, `unban`));
                message.guild.members.unban(b.user.id, reason);
            }
        });   
    }
}