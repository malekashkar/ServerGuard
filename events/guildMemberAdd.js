module.exports = async(client, member) => {
    let guildData = await client.models.config.findById(member.guild.id);
    if(guildData.autorole.length > 0) member.roles.add(guildData.autorole, `Autorole`);

    let premiumData = await client.models.premium.findById(member.guild.id);
    if(premiumData) client.models.join.create({
        user: member.id,
        guild: member.guild.id,
        time: Date.now()
    });
}