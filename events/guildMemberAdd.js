module.exports = async(client, member) => {
    let guildData = await client.models.config.findById(member.guild.id);
    
    if(guildData.verification) member.roles.add(guildData.verification.unverified, `Unverified Role`);
    if(guildData.autorole.length > 0) member.roles.add(guildData.autorole, `Autorole`);

    if(guildData.premium) client.models.join.create({
        user: member.id,
        guild: member.guild.id,
        time: Date.now()
    });
}