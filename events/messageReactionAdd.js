module.exports = async(client, reaction, user) => {
    if(user.bot) return;
    if(reaction.message.partial) reaction.message.fetch();
    
    let message = reaction.message;
    let guildData = await client.models.config.findById(message.guild.id);
    
    if(guildData.verification && message.id === guildData.verification.message && reaction.emoji.name === "✅") {
        reaction.users.remove(user);

        let member = message.guild.members.cache.get(user.id);
        member.roles.add(guildData.verification.verified);
        member.roles.remove(guildData.verification.unverified);
    }
}