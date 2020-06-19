module.exports = async(client, reaction, user) => {
    if(user.bot) return;
    if(reaction.message.partial) reaction.message.fetch();
    
    let message = reaction.message;
    let verData = await client.models.verification.findById(message.guild.id);
    
    /* Verification */
    if(!verData) return;
    if(message.id === verData.message && reaction.emoji.name === "✅") {
        reaction.users.remove(user);
        let role = message.guild.roles.cache.get(verData.role);
        let member = message.guild.members.cache.get(user.id);
        member.roles.add(role);
    }
}