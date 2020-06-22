module.exports = async(client) => {
    let unmute = await client.models.tempban.find({});
    
    unmute.forEach(async u => {
        if(u.time <= Date.now()) {
            let guild = await client.guilds.cache.get(u.guild);
            let role = guild.roles.cache.get(u.mute_role);
            let member = guild.members.cache.get(u._id);

            await client.models.tempmute.deleteOne({ _id: u._id }).exec();
            await member.roles.remove(role);
        };
    });
};