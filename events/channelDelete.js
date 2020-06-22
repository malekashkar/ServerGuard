module.exports = async(client, channel) => {
    let guildData = await client.models.config.findById(channel.guild.id);

    if(guildData && guildData.modlogs && guildData.modlogs === channel.id) {
        guildData.modlogs = ""
        guildData.save();
    }

    if(guildData && guildData.logchannel && guildData.logchannel === channel.id) {
        guildData.logchannel = ""
        guildData.save();
    }
}