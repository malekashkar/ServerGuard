const embeds = require("../utils/embed")
const ms = require("ms");

module.exports = async (client, message) => {
  if(message.channel.type === "dm") return;
  if(message.author.bot) return;

  let guildData = await client.models.config.findById(message.guild.id);
  let spamData = await client.models.spam.findOne({ user: message.author.id });
  let messageData = await client.models.spamsg.findOne({ user: message.author.id });
  let userRoles = message.member.roles.cache.array().map(x => x.id), perms = false;
  
  if(message.member.hasPermission("ADMINISTRATOR")) perms = true;
  else { for(let i = 0; i < userRoles.length; i++) {
    if(guildData.adminrole.includes(userRoles[i])) perms = true;
  }};

  async function action(type, user, type2) {
    let member = message.guild.members.cache.get(user);
  
    if(type === `c`) {
      message.channel.updateOverwrite(message.guild.id, { VIEW_CHANNEL: true, SEND_MESSAGES: false });
      if(guildData.modlogs !== `none`) message.guild.channels.cache.get(guildData.modlogs).send(embeds.log(`Successfully channed locked because of mention spamming/text spamming.`, `channel lock`));
    }
    if(type === `b`) {
      member.ban(`Anti Spam`);
      if(guildData.modlogs !== `none`) message.guild.channels.cache.get(guildData.modlogs).send(embeds.log(`Successfully banned ${member} because of mention spamming/text spamming.`, `ban`));
    }
      
    if(type === `k`) {
      member.kick(`Anti Spam`);
      if(guildData.modlogs !== `none`) message.guild.channels.cache.get(guildData.modlogs).send(embeds.log(`Successfully kicked ${member} because of mention spamming/text spamming.`, `kick`));
    }

    if(type === `m`) {
      let muterole;
      let time;

        if(type2 === `mention`) time = guildData.mentionspam.time;
        else if(type2 === `repeat`) time = guildData.textspam.time;
    
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

        await member.roles.add(muterole);
        if(guildData.modlogs !== `none`) message.guild.channels.cache.get(guildData.modlogs).send(embeds.log(`Successfully muted ${member} because of mention spamming/text spamming.`, `mute`));
    }

    if(type === `tm`) {
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
  
        client.models.tempmute.create({
          _id: member.id,
          guild: message.guild.id,
          time: Date.now() + ms(time)
        });
  
        await member.roles.add(muterole);
        if(guildData.modlogs !== `none`) message.guild.channels.cache.get(guildData.modlogs).send(embeds.log(`Successfully tempmuted ${member} because of mention spamming/text spamming.`, `tempmute`));
    }
  }

  if(message.content.indexOf(guildData.prefix) !== 0) {
    if(guildData.mentionspam && !perms && message.mentions.roles.array().length >= 0 || !message.mentions.users.array().length >= 0) {
        if(spamData && spamData.time + guildData.mentionspam.time <= Date.now()) return client.models.spam.deleteOne({ user: message.author.id });

        let roleAmt = message.mentions.roles.array().length;
        let userAmt = message.mentions.users.array().length;
        
        if(guildData.mentionspam.type === 'role') {
          if(spamData && spamData.amount >= guildData.mentionspam.amount) {
            if(guildData.mentionspam.ping) message.channel.send(guildData.mentionspam.ping.map(x => `<@&${x}>`));
            action(guildData.mentionspam.outcome, message.author.id, `mention`);
            return client.models.spam.deleteOne({ user: message.author.id });
          }

          if(spamData) {
            spamData.amount = spamData.amount + roleAmt;
            spamData.save();
          } else client.models.spam.create({ user: message.author.id, amount: roleAmt });
      } else if(guildData.mentionspam.type === 'user') {
          if(spamData && spamData.amount >= guildData.mentionspam.amount) {
            if(guildData.mentionspam.ping) message.channel.send(guildData.mentionspam.ping.map(x => `<@&${x}>`));
            action(guildData.mentionspam.outcome, message.author.id, `mention`);
            return client.models.spam.deleteOne({ user: message.author.id });
          }

          if(spamData) {
            spamData.amount = spamData.amount + userAmt;
            spamData.save();
          } else client.models.spam.create({ user: message.author.id, amount: userAmt });
      } else if(guildData.mentionspam.type === 'both') {
        if(spamData && spamData.amount >= guildData.mentionspam.amount) {
          if(guildData.mentionspam.ping) message.channel.send(guildData.mentionspam.ping.map(x => `<@&${x}>`));
          action(guildData.mentionspam.outcome, message.author.id, `mention`);
          return client.models.spam.deleteOne({ user: message.author.id });
        }

        if(spamData) {
          spamData.amount = spamData.amount + userAmt + roleAmt;
          spamData.save();
        } else client.models.spam.create({ user: message.author.id, amount: userAmt + roleAmt });
      }
    } else if(guildData.textspam && !perms) {
      if(!messageData) messageData = client.models.spamsg.create({ user: message.author.id, amount: 1, lastmsg: message.content.toLowerCase() });
      if(messageData && messageData.time + guildData.textspam.time <= Date.now()) return client.models.spamsg.deleteOne({ user: message.author.id });

      if(messageData && messageData.amount >= guildData.textspam.amount) {
        if(guildData.textspam.ping) message.channel.send(guildData.textspam.ping.map(x => `<@&${x}>`));
        action(guildData.textspam.outcome, message.author.id, `repeat`);
        return client.models.spamsg.deleteOne({ user: message.author.id });
      }

      if(messageData && messageData.lastmsg === message.content.toLowerCase()) {
        message.delete();
        messageData.amount = messageData.amount + 1;
        messageData.save();
      }
    }
  } else {
    const args = message.content.slice(guildData.prefix.length).trim().split(/ +/g);
    const command = args.shift().toLowerCase();
    const cmd = client.commands.get(command);
    if(!cmd) return;
    
    const cooldownData = await client.models.cooldown.findOne({ user: message.author.id, command: command });
    if(cooldownData && cooldownData.time < Date.now() && perms) {
        client.models.cooldown.deleteOne({ user: message.author.id, command: command }).exec();
        cmd.run(client, message, args);
    } else if(!cooldownData && perms) cmd.run(client, message, args);
  }
};