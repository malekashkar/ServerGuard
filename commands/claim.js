const embeds = require("../utils/embed");

exports.run = async(client, message, args) => {
    let guildData = await client.models.config.findById(message.guild.id);
    let premiumData = await client.models.premium.findById(message.guild.id);

    if(!message.member.roles.cache.some(x => x.id === client.config.premium_role)) return message.channel.send(embeds.error(`Please purchase premium plan on our patreon!`));;
    if(!args[0]) return message.channel.send(embeds.error(`**Usage:** ${guildData.prefix}claim <invite link>`));

    let info = await client.fetchInvite(args[0]);

    if(!premiumData) {
        message.channel.send(embeds.complete(`You have successfuly claimed premium for your server **${info.guild.name}**.`));
        client.models.premium.create({ _id: info.guild.id, user: message.author.id });
    } else message.channel.send(embeds.error(`You already have premium in your server!`));
}