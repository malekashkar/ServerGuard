const embeds = require("../utils/embed.js")

exports.run = async(client, message, args) => {
    let option = args[0];
    let role = message.mentions.roles.first();
    let guildData = await client.models.config.findById(message.guild.id);

    if(!option || !['add', 'list', 'remove'].includes(option)) return message.channel.send(embeds.error(`**Usage:** ${guildData.prefix}autorole [add, remove, list]`));
    if(['add', 'remove'].includes(option) && !message.mentions.roles.first()) return message.channel.send(embeds.error(`**Usage:** ${guildData.prefix}autorole [add, remove] <@role>`));

    if(option === "add") {
        if(guildData.autorole.length === 5 && !guildData.premium) return message.channel.send(embeds.premium(`autorole`))
        if(!(message.guild.me.hasPermission(["MANAGE_ROLES"]) && role.editable)) return message.channel.send(embeds.error(`The bot does not have sufficient permissions to give that role to users.\n\nPlease make sure that:\n**Fix #1.** Move the bot role above the ${role} role.\n**Fix #2.** Give the bot permission to manage other roles.`))
        if(guildData.autorole.includes(role.id)) return message.channel.send(embeds.error(`${role} is already set as an autorole!`));

        guildData.autorole.push(role.id);
        guildData.save();

        message.channel.send(embeds.autorole(`Role ${role} has been added to the autorole list.`, `Role Added`));
    } else if(option === "remove") {
        if(!guildData.autorole.includes(role.id)) return message.channel.send(embeds.error(`${role} is not listed as one of the autoroles.`));

        let newArr = guildData.autorole.filter(id => id !== role.id);
        guildData.autorole = newArr;
        guildData.save();

        message.channel.send(embeds.autorole(`Role ${role} has been removed from the autorole list.`, `Role Removed`));
    } else if(option === "list") {
        let text = guildData.autorole.map((r, i) => `${i + 1}. <@&${r}>\n`).join("");

        if(guildData.autorole.length <= 0) message.channel.send(embeds.error(`You currently have no autoroles setup!`));
        else message.channel.send(embeds.autorole(`Below is the list of roles you currently have setup:\n\n${text}`, `Roles List`));
    }
}