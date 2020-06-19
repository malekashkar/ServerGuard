module.exports = async(client, role) => {
    let guildData = await client.models.config.findById(role.guild.id);

    if(guildData.autorole && guildData.autorole.includes(role.id)) {
        guildData = guildData.autorole.filter(x => x !== role.id);
        guildData.save();
    }
}