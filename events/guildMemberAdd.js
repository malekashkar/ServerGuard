module.exports = async(client, member) => {
    let guildData = await client.models.config.findById(member.guild.id);
    if(guildData.autorole.length > 0) member.roles.add(guildData.autorole, `Autorole`);
}