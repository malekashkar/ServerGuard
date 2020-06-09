const ms = require("ms");
const embeds = require("../utils/embed");

exports.run = async(client, message, args) => {
    let user = args[0];
    let reason = args.splice(1).join(" ");
    let guildData = await client.models.config.findById(message.guild.id);
    
    if(!args[0]) return message.channel.send(embeds.error(`**Usage:** ${guildData.prefix}unban <user tag>`));
    if(!reason) reason = `None`;

    message.guild.fetchBans().then(bans => {
        if(bans.some(u => user.includes(u.tag))) {

            let user = bans.find(user => user.tag === user);
            
            message.guild.unban(user.id, reason);
            message.channel.send(embeds.complete(`Successfully unbanned ${user}.`));

        } else return message.channel.send(embeds.error(`**${user}** is not banned from the server!`));
    });
}