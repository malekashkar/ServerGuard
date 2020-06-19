const embeds = require("../utils/embed");
const ms = require("ms");

exports.run = async(client, message, args) => {
    let guildData = await client.models.config.findById(message.guild.id);
    let premiumData = await client.models.premium.findById(message.guild.id);
    let reason = args.splice(2).join(" ");
    let time = args[1];
    
    if(!args[0] || !time) return message.channel.send(embeds.error(`**Usage:** ${guildData.prefix}tempban <@user/@role> <time> [reason]`));

    if(reason);
    else reason = `No Reason Provided`;

    let role = message.mentions.roles.first();
    let user = message.mentions.members.first();
    let users = message.guild.members.cache;

    if(!premiumData && users.length > 35) users = users.splice(0, 35);
    else if(premiumData && users.length > 150) users = users.splice(0, 150);

    if(role) {
        if(role.permissions.toArray().includes("ADMINISTRATOR")) return message.channel.send(embeds.error(`You cannot ban users with the role ${role} because it has \`ADMINISTRATOR\` permissions.`))

        message.channel.send(embeds.complete(`Successfully temp-banned all users with the role ${role}.`));
        if(guildData.modlogs !== `none`) message.guild.channels.cache.get(guildData.modlogs).send(embeds.log(`Successfully temp-banned all users with the role ${role}.`, `tempban`));
        
        if(!premiumData) {
          client.models.cooldown.create({
            user: message.author.id,
            time: Date.now() + 45000,
            command: `tempban`
          });
        } else {
          client.models.cooldown.create({
            user: message.author.id,
            time: Date.now() + 10000,
            command: `tempban`
          });
        }

        message.guild.members.cache.forEach(async m => {
        if(!m.hasPermission("ADMINISTRATOR") && m.roles.cache.has(role.id)) {
                await m.ban(reason);

                client.models.tempban.create({
                    _id: m.id,
                    guild: message.guild.id,
                    time: Date.now() + ms(time)
                });
            }
        });
    } else if(user) {
      let member = message.guild.members.cache.get(user.id);
      if(member.hasPermission("ADMINISTRATOR")) return message.channel.send(embeds.error(`You cannot ban ${user} because they have \`ADMINISTRATOR\` permissions.`))

      client.models.tempban.create({
        _id: user.id,
        guild: message.guild.id,
        time: Date.now() + ms(time)
      });  

      if(!premiumData) {
        client.models.cooldown.create({
          user: message.author.id,
          time: Date.now() + 45000,
          command: `tempban`
        });
      } else {
        client.models.cooldown.create({
          user: message.author.id,
          time: Date.now() + 10000,
          command: `tempban`
        });
      }

      member.ban(reason);
      message.channel.send(embeds.complete(`Successfully temp-banned ${user}.`));
      if(guildData.modlogs !== `none`) message.guild.channels.cache.get(guildData.modlogs).send(embeds.log(`Successfully temp-banned ${user}.`, `tempban`));
    }
}