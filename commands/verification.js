const embeds = require("../utils/embed");

exports.run = async(client, message, args) => {
    let guildData = await client.models.config.findById(message.guild.id);
    if(!args[0] || ![`enable`, `disable`].includes(args[0])) return message.channel.send(embeds.error(`**Usage:** ${guildData.prefix}verification [enable/disable]`));

    if(args[0] === `enable`) {
        if(!guildData.verification) {
            let channel = await message.guild.channels.create(`verification`);
            let unverified_role = await message.guild.roles.create({ data: { name: `Unverified`, color: `GREEN`, permissions: [] } });
            let verified_role = await message.guild.roles.create({ data: { name: `Verified`, color: `GREEN`, permissions: [] } });
    
            channel.createOverwrite(message.guild.id, { VIEW_CHANNEL: true, SEND_MESSAGES: false, ADD_REACTIONS: true });
            let msg = await channel.send(embeds.verification()); msg.react("✅");
    
            message.channel.send(embeds.complete(`Verification channel ${channel} created.\nAlso, unverified role ${unverified_role}, and verified role ${verified_role} created.\nPlease make sure both roles are about auto roles!`));
    
            client.models.verification.create({
                _id: message.guild.id,
                channel: channel.id,
                message: msg.id,
                unverified: unverified_role.id,
                verified: verified_role.id
            });
        } else {
            let first = await message.channel.send(embeds.question(`What would you like to change the verification channel to?`, `Please tag a channel or say "no" not to change the current channel.`))
            let collector = message.channel.createMessageCollector(m => m.author.id === message.author.id && m.mentions.channels.first() || m.content === "no", { max: 1 });
            collector.on('collect', async m => {
                first.delete(); m.delete();

                if(m.content === 'no') return;
                let channel = m.mentions.channels.first();
    
                channel.createOverwrite(message.guild.id, { VIEW_CHANNEL: true, SEND_MESSAGES: false, ADD_REACTIONS: true });
                let msg = await channel.send(embeds.verification()); msg.react("✅");
                message.channel.send(embeds.complete(`The verification channel has been updated to ${channel}`));
                
                guildData.verification.channel = channel.id;
                guildData.verification.message = msg.id;
                guildData.verification.save();
            });
        }
    } else {
        message.guild.channels.cache.get(guildData.verification.channel).delete();
        message.guild.roles.cache.get(guildData.verification.unverified).delete();
        message.guild.roles.cache.get(guildData.verification.verified).delete();
        await client.models.verification.deleteOne({ _id: message.guild.id }).exec();

        message.channel.send(embeds.complete(`Verification has successfuly been disabled.`));
    }
}