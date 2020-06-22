module.exports = async(client) => {
    let unban = await client.models.tempban.find({});
    
    unban.forEach(async u => {
        if(u.time <= Date.now()) {
            let guild = await client.guilds.cache.get(u.guild);
            let bans = await guild.fetchBans();
        
            bans.forEach(async b => {
                if(b.user.id === u._id) guild.members.unban(b.user.id);
                await client.models.tempban.deleteOne({ _id: u._id }).exec();
            });   
        };
    });
};