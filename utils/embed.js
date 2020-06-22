const Discord = require("discord.js");
const config = require("../config");

function error(text) {
    let embed = new Discord.MessageEmbed()
    .setColor(config.color)
    .setTitle(`Error`)
    .setDescription(text + `\n\nJoin support server [here](${config.discord_invite}).`)
    .setFooter(config.name)
    .setTimestamp()

    return embed;
}

function complete(text) {
    let embed = new Discord.MessageEmbed()
    .setColor(config.color)
    .setTitle(`Complete`)
    .setDescription(text)
    .setFooter(config.name)
    .setTimestamp()

    return embed;
}

function premium_end() {
    let embed = new Discord.MessageEmbed()
    .setColor(config.color)
    .setTitle(`Premium Ended`)
    .setDescription(`Your premium plan has ended. Click [here](${config.patreon_link}) to renew it!`)
    .setFooter(config.name)
    .setTimestamp()

    return embed;
}

function autorole(text, option) {
    let embed = new Discord.MessageEmbed()
    .setColor(config.color)
    .setTitle(`Auto Role | ${option}`)
    .setDescription(text)
    .setFooter(config.name)
    .setTimestamp()

    return embed;
}

function premium(mode) {
    let amount = 0, type = ``;
    if(mode === 'autorole') { amount = 5; type = `autoroles`}

    let embed = new Discord.MessageEmbed()
    .setColor(config.color)
    .setTitle(`Upgrade to Premium`)
    .setDescription(`You have reached the max limit of **${amount}** for **${type}**.\nTo extend this time please purchase premium with the **premium command.**`)
    .setFooter(config.name)
    .setTimestamp()

    if(mode === 'verification') embed.setDescription(`Please upgrade to premium in order to re-setup your verification information.`);
    if(mode === 'prefix') embed.setDescription(`Please upgrade to premium in order to config your server commands prefix.`);
    if(mode === 'join') embed.setDescription(`Please upgrade to premium in order to use the join command.`);

    return embed;
}

function question(text, des) {
    let embed = new Discord.MessageEmbed()
    .setColor(config.color)
    .setTitle(text)
    .setDescription(des)
    .setFooter(`You have 16 minutes to answer this question.`)

    return embed;
}

function verification() {
    let embed = new Discord.MessageEmbed()
    .setColor(config.color)
    .setTitle(`Verification`)
    .setDescription(`Click the ✅ under this message to verify yourself.`)
    .setFooter(`After clicking the check you will have access to the entire discord.`)

    return embed;
}

function log(text, type) {
    if(type === `kick`) type = `Member Kicked`;
    if(type === `ban`) type = `Member Banned`;
    if(type === `mute`) type = `Member Muted`;
    if(type === `tempmute`) type = `Member Tempmuted`;
    if(type === `tempban`) type = `Member Tempbanned`;
    if(type === `channel lock`) type = `Channel Locked`

    let embed = new Discord.MessageEmbed()
    .setColor(config.color)
    .setTitle(type)
    .setDescription(text)
    .setFooter(`Moderation Logs`)

    return embed;
}

module.exports = {
    error,
    complete,
    autorole,
    premium,
    question,
    verification,
    log,
    premium_end
}