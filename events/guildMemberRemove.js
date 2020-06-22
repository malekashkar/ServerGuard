module.exports = async(client, member) => {
    let guildData = await client.models.config.findById(member.guild.id);

    if(guildData && guildData.lockbypass_users && guildData.lockbypass_users.includes(member.user.id)) {
        guildData.lockbypass_users = guildData.lockbypass_users.filter(x => x !== member.user.id);
        guildData.save();
    }

    if(member.guild.id === client.config.main_guild) {
        let premiums = await client.models.config.find({ user: member.user.id });
        premiums.forEach(server => {
            if(server.autorole.length > 5) server.autorole.slice(0,5);
            if(server.mentionspam.time > 60000) server.mentionspam.time = 60000;
            if(server.textspam.time > 60000) server.textspam.time = 60000;
            if(server.mentionspam.ping.length > 1) server.mentionspam.ping = server.mentionspam.ping.slice(0, 1);
            if(server.textspam.ping.length > 1) server.textspam.ping = server.textspam.ping.slice(0, 1);
    
            server.save();
        });
    }
}