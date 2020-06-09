const Discord = require("discord.js");
const client = new Discord.Client({partials: ["MESSAGE", "REACTION", "CHANNEL"]});
const config = require('./config');
const Enmap = require("enmap");
const fs = require("fs");

client.commands = new Enmap();
client.config = config;
client.models = {
  config: require('./database/models/config'),
  autorole: require('./database/models/autorole'),
  premium: require('./database/models/premium'),
  mentionspam: require('./database/models/mentionspam'),
  tempban: require('./database/models/tempban'),
  tempmute: require('./database/models/tempmute'),
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