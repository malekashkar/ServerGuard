module.exports = async(client, role) => {
    let guildData = await client.models.config.findById(role.guild.id);

    if(guildData && guildData.autorole && guildData.autorole.includes(role.id)) {
        guildData.autorole = guildData.autorole.filter(x => x !== role.id);
        guildData.save();
    }

    if(guildData && guildData.lockbypass_roles && guildData.lockbypass_roles.includes(role.id)) {
        guildData.lockbypass_roles = guildData.lockbypass_roles.filter(x => x !== role.id);
        guildData.save();
    }

    if(guildData && guildData.adminrole && guildData.adminrole.includes(role.id)) {
        guildData.adminrole = guildData.adminrole.filter(x => x !== role.id);
        guildData.save();
    }

    if(guildData && guildData.muterole && guildData.muterole === role.id) {
        guildData.muterole = ""
        guildData.save();
    }
}