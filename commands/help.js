const embeds = require('../utils/embed');
const Discord = require("discord.js");
const fs = require("fs");

exports.run = async(client, message, args) => {
    let guildData = await client.models.config.findById(message.guild.id);
    let files = fs.readdirSync("./help/");
    let array = [];

    files.forEach(file => {
        let description = fs.readFileSync(`./help/${file}`, 'utf8').replace(/-p-/gm, guildData.prefix);
        let name = file.split(".")[0];
        array.push({name: name, description: description});
    });

    if(args[0]) {
        let found = false;

        array.forEach(cmd => {
            if(args[0].toLowerCase() === cmd.name) {
                found = true;

                let embed = new Discord.MessageEmbed()
                .setColor(client.config.color)
                .setTitle(`Help Menu - ${args[0]}`)
                .setDescription(cmd.description)
                message.channel.send(embed);
            };
        });
        
        if(!found) return message.channel.send(embeds.error(`**${args[0]}** is not a command! Please use \`${guilData.prefix}help\` to get a list of commands!`));

    } else {

        let commands = array.map((v, i) => `${i + 1}. **${v.name}**\n`).join("");
        let embed = new Discord.MessageEmbed()
        .setColor(client.config.color)
        .setTitle(`Help Menu`)
        .setFooter(`Support Server: ${client.config.discord_invite}`)
        .setTimestamp()
        .setDescription(`Below are all the commands, use \`${guildData.prefix}help <command>\` to get specific information on a command.\n\n${commands}`)
        message.channel.send(embed);

    }
}