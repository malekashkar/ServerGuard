const embeds = require("../utils/embed");

exports.run = async(client, message, args) => {
    let guildData = await client.models.config.findById(message.guild.id);
    let premiumData = await client.models.premium.findById(message.guild.id);
    let reason = args.splice(1).join(" ");

    if(!args[0]) return message.channel.send(embeds.error(`**Usage:** ${guildData.prefix}kick <@user/@role> [reason]`));

    if(reason);
    else reason = `No Reason Provided`;

    let role = message.mentions.roles.first();
    let user = message.mentions.members.first();
    let users = message.guild.members.cache;

    if(!premiumData && users.length > 35) users = users.splice(0, 35);
    else if(premiumData && users.length > 150) users = users.splice(0, 150);

    if(role) {
        if(role.permissions.toArray().includes("ADMINISTRATOR")) return message.channel.send(embeds.error(`You cannot kick users with the role ${role} because it has \`ADMINISTRATOR\` permissions.`))
        
        message.channel.send(embeds.complete(`Successfully kicked all users with the role ${role}.`));
        if(guildData.modlogs !== `none`) message.guild.channels.cache.get(guildData.modlogs).send(embeds.log(`Successfully kicked all users with the role ${role}.`, `kick`));

        if(!premiumData) {
          client.models.cooldown.create({
            user: message.author.id,
            time: Date.now() + 45000,
            command: `kick`
          });
        } else {
          client.models.cooldown.create({
            user: message.author.id,
            time: Date.now() + 10000,
            command: `kick`
          });
        }

        message.guild.members.cache.forEach(async m => {
            if(!m.hasPermission("ADMINISTRATOR") && m.roles.cache.has(role.id)) {
                await m.kick(reason);
            }
        });
    } else if(user) {
        await user.kick(reason);
        message.channel.send(embeds.complete(`Successfully kicked ${user} from the server.`));
        if(guildData.modlogs !== `none`) message.guild.channels.cache.get(guildData.modlogs).send(embeds.log(`Successfully kicked ${user} from the server.`, `kick`));

        if(!premiumData) {
          client.models.cooldown.create({
            user: message.author.id,
            time: Date.now() + 45000,
            command: `kick`
          });
        } else {
          client.models.cooldown.create({
            user: message.author.id,
            time: Date.now() + 10000,
            command: `kick`
          });
        }
    }
}