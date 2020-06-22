const embeds = require("../utils/embed");
const ms = require("ms");

exports.run = async(client, message, args) => {
    let guildData = await client.models.config.findById(message.guild.id);
    let reason = args.splice(2).join(" ");
    let time = args[1];
    
    if(!args[0] || !time) return message.channel.send(embeds.error(`**Usage:** ${guildData.prefix}tempmute <@user/@role> <time> [reason]`));

    let role = message.mentions.roles.first();
    let user = message.mentions.members.first();
    let users = message.guild.members.cache;
    let muterole;

    if(!guildData.muterole) {
      try {
        muterole = await message.guild.roles.create({
          data: {
            name: `Muted`,
            color: `BLACK`
        }});

        guildData.muterole = muterole.id;
        guildData.save();

        message.guild.channels.cache.forEach(async c => {
          await c.createOverwrite(muterole, { SEND_MESSAGES: false, ADD_REACTIONS: false });
        });
      } catch(e) {
        console.log(e.stack);
      }
    } else muterole = message.guild.roles.cache.get(guildData.muterole);

    if(!guildData.premium && users.length > 35) users = users.splice(0, 35);
    else if(guildData.premium && users.length > 150) users = users.splice(0, 150);

    if(role) {
        if(role.permissions.toArray().includes("ADMINISTRATOR")) return message.channel.send(embeds.error(`You cannot tempmute users with the role ${role} because it has \`ADMINISTRATOR\` permissions.`))

        message.channel.send(embeds.complete(`Successfully tempmuted all users with the role ${role}${reason ? ` because of **${reason}**` : ``}.`));
        if(guildData.modlogs !== `none`) message.guild.channels.cache.get(guildData.modlogs).send(embeds.log(`Successfully tempmuted all users with the role ${role}${reason ? ` because of **${reason}**` : ``}.`, `tempmute`));
        
        if(!guildData.premium) {
          client.models.cooldown.create({
            user: message.author.id,
            time: Date.now() + 45000,
            command: `tempmute`
          });
        } else {
          client.models.cooldown.create({
            user: message.author.id,
            time: Date.now() + 10000,
            command: `tempmute`
          });
        }

        message.guild.members.cache.forEach(async m => {
            if(!m.hasPermission("ADMINISTRATOR") && m.roles.cache.has(role.id) && !m.roles.cache.has(muterole.id)) {
                await m.roles.add(muterole);
                if(guildData.dmlogs) m.send(embeds.log(`You were tempmuted in **${message.guild.name} for ${ms(time)}**${reason ? ` because of **${reason}**` : ``}.`, `tempmute`));

                client.models.tempmute.create({
                    _id: m.id,
                    guild: message.guild.id,
                    time: Date.now() + ms(time),
                    mute_role: muterole.id
                });
            }
        });
    } else if(user) {
      let member = message.guild.members.cache.get(user.id);
      if(member.hasPermission("ADMINISTRATOR")) return message.channel.send(embeds.error(`You cannot tempmute ${user} because they have \`ADMINISTRATOR\` permissions.`))
      if(member.roles.cache.has(muterole.id)) return message.channel.send(embeds.error(`User ${user} is already tempmuted!`))

      if(!guildData.premium) {
        client.models.cooldown.create({
          user: message.author.id,
          time: Date.now() + 45000,
          command: `tempmute`
        });
      } else {
        client.models.cooldown.create({
          user: message.author.id,
          time: Date.now() + 10000,
          command: `tempmute`
        });
      }

      client.models.tempmute.create({
        _id: user.id,
        guild: message.guild.id,
        time: Date.now() + ms(time),
        mute_role: muterole.id
      });  

      await member.roles.add(muterole);
      message.channel.send(embeds.complete(`Successfully tempmuted ${user}${reason ? ` because of **${reason}**` : ``}.`));
      if(guildData.dmlogs) user.send(embeds.log(`You were tempmuted in **${message.guild.name} for ${ms(time)}**${reason ? ` because of **${reason}**` : ``}.`, `tempmute`));
      if(guildData.modlogs !== `none`) message.guild.channels.cache.get(guildData.modlogs).send(embeds.log(`Successfully tempmuted ${user}${reason ? ` because of **${reason}**` : ``}.`, `tempmute`));
    }
}