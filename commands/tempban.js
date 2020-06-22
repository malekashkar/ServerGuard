const embeds = require("../utils/embed");
const ms = require("ms");

exports.run = async(client, message, args) => {
    let guildData = await client.models.config.findById(message.guild.id);
    let reason = args.splice(2).join(" ");
    let time = args[1];
    
    if(!args[0] || !time) return message.channel.send(embeds.error(`**Usage:** ${guildData.prefix}tempban <@user/@role> <time> [reason]`));

    let role = message.mentions.roles.first();
    let user = message.mentions.members.first();
    let users = message.guild.members.cache;

    if(!guildData.premium && users.length > 35) users = users.splice(0, 35);
    else if(guildData.premium && users.length > 150) users = users.splice(0, 150);

    if(role) {
        if(role.permissions.toArray().includes("ADMINISTRATOR")) return message.channel.send(embeds.error(`You cannot ban users with the role ${role} because it has \`ADMINISTRATOR\` permissions.`))

        message.channel.send(embeds.complete(`Successfully temp-banned all users with the role ${role}${reason ? ` because of **${reason}**` : ``}.`));
        if(guildData.modlogs !== `none`) message.guild.channels.cache.get(guildData.modlogs).send(embeds.log(`Successfully temp-banned all users with the role ${role}${reason ? ` because of **${reason}**` : ``}.`, `tempban`));
        
        if(!guildData.premium) {
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
          if(guildData.dmlogs) user.send(embeds.log(`You were tempbanned in **${message.guild.name} for ${ms(time)}**${reason ? ` because of **${reason}**` : ``}.`, `tempban`));
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

      if(!guildData.premium) {
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

      if(guildData.dmlogs) user.send(embeds.log(`You were tempbanned in **${message.guild.name} for ${ms(time)}**${reason ? ` because of **${reason}**` : ``}.`, `tempban`));
      await member.ban(reason);
      message.channel.send(embeds.complete(`Successfully temp-banned ${user}${reason ? ` because of **${reason}**` : ``}.`));
      if(guildData.modlogs !== `none`) message.guild.channels.cache.get(guildData.modlogs).send(embeds.log(`Successfully temp-banned ${user}${reason ? ` because of **${reason}**` : ``}.`, `tempban`));
    }
}