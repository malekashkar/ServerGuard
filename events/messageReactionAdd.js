module.exports = async(client, reaction, user) => {
    if(user.bot) return;
    if(reaction.message.partial) reaction.message.fetch();
    
    let verData = client.models.verification.findByID(message.guild.id);
    let message = reaction.message;
    
    /* Verification */
    if(!verData) return;
    if(message.id === verData.message && reaction.emoji.name === "✅") {
        let role = message.guild.roles.cache.get(verData.role);
        let member = message.guild.members.cache.get(user.id);
        member.roles.add(role);
    }
}