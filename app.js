const Discord = require("discord.js");
const client = new Discord.Client({partials: ["MESSAGE", "REACTION", "CHANNEL"]});
const config = require('./config');
const Enmap = require("enmap");
const fs = require("fs");
const recent = new Set();

client.commands = new Enmap();
client.config = config;
client.recent = recent;
client.models = {
  autorole: require('./database/models/autorole'),
  config: require('./database/models/config'),
  cooldown: require('./database/models/cooldown'),
  join: require('./database/models/join'),
  mentionspam: require('./database/models/mentionspam'),
  premium: require('./database/models/premium'),
  spam: require('./database/models/spam'),
  spamsg: require('./database/models/spamsg'),
  tempban: require('./database/models/tempban'),
  tempmute: require('./database/models/tempmute'),
  textspam: require('./database/models/textspam'),
  verification: require('./database/models/verification'),
};

fs.readdir("./events/", (err, files) => {
  if (err) return console.error(err);
  files.forEach(file => {
    const event = require(`./events/${file}`);
    let eventName = file.split(".")[0];
    client.on(eventName, event.bind(null, client));
  });
});

fs.readdir("./commands/", (err, files) => {
  if (err) return console.error(err);
  files.forEach(file => {
    if (!file.endsWith(".js")) return;
    let props = require(`./commands/${file}`);
    let commandName = file.split(".")[0];
    client.commands.set(commandName, props);
  });
});

client.login(config.token);

client.on("channelCreate", async channel => {
  if(channel.type === "dm") return;

  let guildData = await client.models.config.findById(channel.guild.id);
  let logChannel = channel.guild.channels.cache.get(guildData.logchannel);
  if(!logChannel) return;
  
  let embed = new Discord.MessageEmbed()
  .setColor(config.color)
  .setTitle(`Channel Created`)
  .setDescription(`Channel **#${channel.name}** has been created.`)
  .setTimestamp()
  logChannel.send(embed);
});

client.on("channelDelete", async channel => {
  if(channel.type === "dm") return;
  
  let guildData = await client.models.config.findById(channel.guild.id);
  let logChannel = channel.guild.channels.cache.get(guildData.logchannel);
  if(!logChannel) return;
  
  let embed = new Discord.MessageEmbed()
  .setColor(config.color)
  .setTitle(`Channel Deleted`)
  .setDescription(`Channel **#${channel.name}** has been deleted.`)
  .setTimestamp()
  logChannel.send(embed);
});

client.on("guildBanAdd", async(guild, user) => {
  let guildData = await client.models.config.findById(guild.id);
  let logChannel = guild.channels.cache.get(guildData.logchannel);
  if(!logChannel) return;
  
  let embed = new Discord.MessageEmbed()
  .setColor(config.color)
  .setTitle(`Member Banned`)
  .setDescription(`${user} has been banned from the discord server.`)
  .setTimestamp()
  logChannel.send(embed);
});

client.on("guildBanRemove", async(guild, user) => {
  let guildData = await client.models.config.findById(guild.id);
  let logChannel = guild.channels.cache.get(guildData.logchannel);
  if(!logChannel) return;
  
  let embed = new Discord.MessageEmbed()
  .setColor(config.color)
  .setTitle(`Member Unbanned`)
  .setDescription(`${user} has been unbanned from the discord server.`)
  .setTimestamp()
  logChannel.send(embed);
});

client.on("guildMemberAdd", async member => {
  let guildData = await client.models.config.findById(member.guild.id);
  let logChannel = member.guild.channels.cache.get(guildData.logchannel);
  if(!logChannel) return;
  
  let embed = new Discord.MessageEmbed()
  .setColor(config.color)
  .setTitle(`Member Joined`)
  .setDescription(`${member} joined the discord server.`)
  .setTimestamp()
  logChannel.send(embed);
});

client.on("guildMemberRemove", async member => {
  let guildData = await client.models.config.findById(member.guild.id);
  let logChannel = member.guild.channels.cache.get(guildData.logchannel);
  if(!logChannel) return;
  
  let embed = new Discord.MessageEmbed()
  .setColor(config.color)
  .setTitle(`Member Left`)
  .setDescription(`${member} left the discord server.`)
  .setTimestamp()
  logChannel.send(embed);
});

client.on("guildMemberUpdate", async(oldMember, newMember) => {
  let guildData = await client.models.config.findById(oldMember.guild.id);
  let logChannel = oldMember.guild.channels.cache.get(guildData.logchannel);
  if(!logChannel) return;
  
  if(oldMember.nickname !== newMember.nickname) {
    if(!newMember.nickname) {
      let embed = new Discord.MessageEmbed()
      .setColor(config.color)
      .setTitle(`Nickname Changed`)
      .setDescription(`${newMember} removed their nickname.`)
      .setTimestamp()
      logChannel.send(embed);
    } else {
      let embed = new Discord.MessageEmbed()
      .setColor(config.color)
      .setTitle(`Nickname Changed`)
      .setDescription(`${newMember} nickname changed to ${newMember.nickname}.`)
      .setTimestamp()
      logChannel.send(embed);
    }
  }
});

client.on("messageDelete", async message => {
  let guildData = await client.models.config.findById(message.guild.id);
  let logChannel = message.guild.channels.cache.get(guildData.logchannel);
  if(!logChannel) return;
  
  if(message.content === undefined) return;
  if(message.content === ``) return;
  
  let embed = new Discord.MessageEmbed()
  .setColor(config.color)
  .setTitle(`Message Deleted`)
  .setDescription(`Message: **\`${message.content}\`** deleted.`)
  .setTimestamp()
  logChannel.send(embed);
});

client.on("messageUpdate", async(oldMessage, newMessage) => {
  if(newMessage.channel.type === "dm") return;
  if(newMessage.content === "") return;
  
  let guildData = await client.models.config.findById(oldMessage.guild.id);
  let logChannel = oldMessage.guild.channels.cache.get(guildData.logchannel);
  if(!logChannel) return;
  
  let embed = new Discord.MessageEmbed()
  .setColor(config.color)
  .setTitle(`Message Changed`)
  .setDescription(`${oldMessage.author} updated his message.`)
  .addField(`Old Message`, oldMessage.content, true)
  .addField(`New Message`, newMessage.content, true)
  .setTimestamp()
  logChannel.send(embed);
});

client.on("roleCreate", async role => {
  let guildData = await client.models.config.findById(role.guild.id);
  let logChannel = role.guild.channels.cache.get(guildData.logchannel);
  if(!logChannel) return;
  
  let embed = new Discord.MessageEmbed()
  .setColor(config.color)
  .setTitle(`Role Created`)
  .setDescription(`The role ${role} has been created.`)
  .setTimestamp()
  logChannel.send(embed);
});

client.on("roleDelete", async role => {
  let guildData = await client.models.config.findById(role.guild.id);
  let logChannel = role.guild.channels.cache.get(guildData.logchannel);
  if(!logChannel) return;
  
  let embed = new Discord.MessageEmbed()
  .setColor(config.color)
  .setTitle(`Role Deleted`)
  .setDescription(`The role ${role} has been deleted.`)
  .setTimestamp()
  logChannel.send(embed);
});