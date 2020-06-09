const Discord = require("discord.js");
const config = require("../config");

function error(text) {
    let embed = new Discord.MessageEmbed()
    .setColor("RED")
    .setTitle(`Error`)
    .setDescription(text)
    .setFooter(config.name)
    .setTimestamp()

    return embed;
}

function complete(text) {
    let embed = new Discord.MessageEmbed()
    .setColor("GREEN")
    .setTitle(`Complete`)
    .setDescription(text)
    .setFooter(config.name)
    .setTimestamp()

    return embed;
}

function autorole(text, option) {
    let embed = new Discord.MessageEmbed()
    .setColor("GREEN")
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
    .setColor("#ffd700")
    .setTitle(`Upgrade to Premium`)
    .setDescription(`You have reached the max limit of **${amount}** for **${type}**.\nPlease upgrade to premium to get further access to this feature.`)
    .setFooter(config.name)
    .setTimestamp()

    return embed;
}

function question(text, des) {
    let embed = new Discord.MessageEmbed()
    .setColor("GREEN")
    .setTitle(text)
    .setDescription(des)
    .setFooter(`You have 16 minutes to answer this question.`)

    return embed;
}

module.exports = {
    error,
    complete,
    autorole,
    premium,
    question
}