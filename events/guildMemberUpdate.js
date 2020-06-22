const embeds = require("../utils/embed");

module.exports = async(client, oldMember, newMember) => {
    if(newMember.guild.id !== client.config.main_guild || !oldMember._roles.includes(client.config.premium_role) || newMember._roles.includes(client.config.premium_role)) return;

    newMember.send(embeds.premium_end());
    await client.models.premium.deleteOne({ user: newMember.user.id }).exec();

    let premiums = await client.models.config.find({ user: message.author.id });
    premiums.forEach(server => {
        if(server.autorole.length > 5) server.autorole.slice(0,5);
        if(server.mentionspam.time > 60000) server.mentionspam.time = 60000;
        if(server.textspam.time > 60000) server.textspam.time = 60000;
        if(server.mentionspam.ping.length > 1) server.mentionspam.ping = server.mentionspam.ping.slice(0, 1);
        if(server.textspam.ping.length > 1) server.textspam.ping = server.textspam.ping.slice(0, 1);

        server.save();
    });
}