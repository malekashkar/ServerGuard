const embeds = require("../utils/embed");

module.exports = async(client, oldMember, newMember) => {
    if(newMember.guild.id !== client.config.main_guild) return;
    if(oldMember._roles.includes(client.config.premium_role) && !newMember._roles.includes(client.config.premium_role)) {
        await client.models.premium.deleteOne({ user: newMember.user.id }).exec();
        newMember.send(embeds.premium_end())
        return;
    }
}