const embeds = require("../utils/embed");

exports.run = async(client, message, args) => {
    let options = ['enable', `disable`];
    let guildData = await client.models.config.findById(message.guild.id);
    let premiumData = await client.models.premium.findById(message.guild.id);
    let verData = await client.models.verification.findByID(message.guild.id);

    if(!args[0] || options.includes(args[0].toLowerCase())) return message.channel.send(embeds.error(`**Usage:** ${guildData.prefix}verification [enable/disable]`));

    if(!verData) {
        let channel = await message.guild.channels.create(`verification`);
        let role = await message.guild.roles.create({ data: { name: `Verification`, color: `GREEN`, permissions: [] } });

        channel.createOverwrite(message.guild.id, { VIEW_CHANNEL: true, SEND_MESSAGES: false, ADD_REACTIONS: true });
        let msg = await channel.send(embeds.verification); msg.react("✅");

        message.channel.send(embeds.complete(`Verification has been created in ${channel} with the role ${role}.\n**DO NOT** forget to config verification channel permissions.`));

        client.models.verification.create({
            _id: message.guild.id,
            channel: channel.id,
            message: msg.id,
            role: role.id
        });
    } else {
        if(!premiumData) return message.channel.send(embeds.premium('verification'));

        let first = await message.channel.send(embeds.question(`What would you like to change the verification channel to?`, `Please tag a channel or say "no" not to change the current channel.`))
        let collector = message.channel.createMessageCollector(m => m.author.id === message.author.id && m.mentions.channels.first() || m.content === "no", { max: 1 });
        collector.on('collect', async m => {
            first.delete(); m.delete();

            let channel;
            if(m.mentions.channels.first()) channel = m.mentions.channels.first();
            else channel = "same";

            let second = await message.channel.send(embeds.question(`What would you like to change the verification role to?`, `Please tag a role or say "no" not to change the current role.`))
            let collector = message.channel.createMessageCollector(m => m.author.id === message.author.id && m.mentions.roles.first() || m.content === "no", { max: 1 });
            collector.on('collect', async m => {
                second.delete(); m.delete();
    
                let role;
                if(m.mentions.roles.first()) role = m.mentions.roles.first();
                else role = "same";

                if(channel !== "same" && role !== `same`) {
                    channel.createOverwrite(message.guild.id, { VIEW_CHANNEL: true, SEND_MESSAGES: false, ADD_REACTIONS: true });
                    let msg = await channel.send(embeds.verification); msg.react("✅");
                    message.channel.send(embeds.complete(`Verification channel updated to ${channel} with the role ${role}.\n**DO NOT** forget to config verification channel permissions.`));
                    
                    verData.role = role.id;
                    verData.channel = channel.id;
                    verData.message = msg.id;
                    verData.save();
                } else if(channel !== "same" && role === "same") {            
                    channel.createOverwrite(message.guild.id, { VIEW_CHANNEL: true, SEND_MESSAGES: false, ADD_REACTIONS: true });
                    let msg = await channel.send(embeds.verification); msg.react("✅");
                    message.channel.send(embeds.complete(`Verification has been updated to ${channel}.`));
                
                    verData.channel = channel.id;
                    verData.message = msg.id;
                    verData.save();
                } else if(role !== "same" && channel === "same") {            
                    message.channel.send(embeds.complete(`Verification role has been updated to ${role}.\n**DO NOT** forget to config verification channel permissions.`));
                   
                    verData.role = role.id;
                    verData.save();
                } else return;
            });
        });
    }
}