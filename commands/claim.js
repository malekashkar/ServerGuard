const embeds = require("../utils/embed");

exports.run = async(client, message, args) => {
    let roles = message.guild.roles.cache.array().map(x => x.id), amount;
    let premium_one = message.guild.roles.cache.get(`717764255084052490`);
    let premium_two = message.guild.roles.cache.get(`723235248850206851`);
    let premium_three = message.guild.roles.cache.get(`723235304890433706`);
    if(!premium_one || !premium_two || !premium_three) return;

    if(roles.includes(premium_one.id)) amount + 1;
    if(roles.includes(premium_two.id)) amount + 2;
    if(roles.includes(premium_three.id)) amount + 3;
    
    let guildData = await client.models.config.findById(message.guild.id);
    let premiums = await client.models.config.find({ user: message.author.id });
    
    if(amount === 0) return message.channel.send(embeds.error(`Please purchase premium plan on our patreon!`));
    if(!args[0]) return message.channel.send(embeds.error(`**Usage:** ${guildData.prefix}claim <invite link>`));
    if(premiums.length >= amount) return message.channel.send(embeds.error(`You rached the limit of **${amount}** servers with premium!`));

    let info = await client.fetchInvite(args[0]);

    message.channel.send(embeds.complete(`You have successfuly claimed premium for your server **${info.guild.name}**.`));
    await client.models.config.create({ _id: info.guild.id, owner: info.guild.ownerID });
}