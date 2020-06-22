module.exports = async(client, guild) => {
    let guildData = await client.models.config.findById(guild.id);
    if(guildData) await client.models.config.deleteById(guild.id).exec();
    if(guildData.premium) await client.models.premium.deleteById(guild.id).exec();
}