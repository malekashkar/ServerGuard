const ms = require("ms");
const embeds = require("../utils/embed");

exports.run = async(client, message, args) => {
    let guildData = await client.models.config.findById(message.guild.id);
    let premiumData = await client.models.premium.findById(message.guild.id);
    
    if(!args[0]) return message.channel.send(embeds.error(`**Usage:** ${guildData.prefix}unmute <@user/@role>`));

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

    if(!premiumData && users.length > 35) users = users.splice(0, 35);
    else if(premiumData && users.length > 150) users = users.splice(0, 150);

    if(role) {
        if(role.permissions.toArray().includes("ADMINISTRATOR")) return message.channel.send(embeds.error(`You cannot unmute users with the role ${role} because it has \`ADMINISTRATOR\` permissions.`))
        
        message.channel.send(embeds.complete(`Successfully unmuted all users with the role ${role}.`));
        if(guildData.modlogs !== `none`) message.guild.channels.cache.get(guildData.modlogs).send(embeds.log(`Successfully unmuted all users with the role ${role}.`, `unmute`));
        message.guild.members.cache.forEach(async m => {
            if(!m.hasPermission("ADMINISTRATOR") && m.roles.cache.has(role.id) && m.roles.cache.has(muterole.id)) {
                await m.roles.remove(muterole);
            }
        });
    } else if(user) {
      let member = message.guild.members.cache.get(user.id);
      if(member.hasPermission("ADMINISTRATOR")) return message.channel.send(embeds.error(`You cannot unmute ${user} because they has \`ADMINISTRATOR\` permissions.`))
      if(!member.roles.cache.has(muterole.id)) return message.channel.send(embeds.error(`User ${user} is not muted!`))

      await member.roles.remove(muterole);
      message.channel.send(embeds.complete(`Successfully unmuted ${user}.`));
      if(guildData.modlogs !== `none`) message.guild.channels.cache.get(guildData.modlogs).send(embeds.log(`Successfully unmuted ${user}.`, `unmute`));
    }
}