const Discord = require("discord.js");
const config = require("../config");

function error(text) {
    let embed = new Discord.MessageEmbed()
    .setColor(config.color)
    .setTitle(`Error`)
    .setDescription(text)
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
    .setDescription(`You have reached the max limit of **${amount}** for **${type}**.\nPlease upgrade to premium to get further access to this feature.`)
    .setFooter(config.name)
    .setTimestamp()

    if(mode === 'verification') embed.setDescription(`Please upgrade to premium in order to re-setup your verification information.`)

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

module.exports = {
    error,
    complete,
    autorole,
    premium,
    question,
    verification
}