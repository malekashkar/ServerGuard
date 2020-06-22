const embeds = require("../utils/embed");
const ms = require("ms");

exports.run = async(client, message, args) => {
    let guildData = await client.models.config.findById(message.guild.id);
    let joinData = await client.models.join.find({});
    if(!guildData.premium) return message.channel.send(embeds.premium('join'));

    let time = args[1];
    let options = [`ban`, `kick`, `mute`];
    if(!args[0] || !time && !options.includes(args[0])) return message.channel.send(embeds.error(`**Usage:** ${guildData.prefix}join [lock/ban/kick/mute] [time]`))

    if(args[0] === `ban`) {
        joinData.forEach(async j => {
            if(j.time >= (Date.now() - ms(time))) {
                await message.guild.members.cache.get(j.user).ban(`Join Command`);
            }
        });
        
        message.channel.send(embeds.complete(`Successfuly **banned all members** that joined in the past **${time}**.`));
    } else if(args[0] === `kick`) {
        joinData.forEach(async j => {
            if(j.time >= (Date.now() - ms(time))) {
                await message.guild.members.cache.get(j.user).kick(`Join Command`);
            }
        });

        message.channel.send(embeds.complete(`Successfuly **kicked all members** that joined in the past **${time}**.`));
    } else if(args[0] === `mute`) {
        joinData.forEach(async j => {
            if(j.time >= (Date.now() - ms(time))) {
                let guildData = await client.models.config.findById(message.guild.id);                
                let member = message.guild.members.cache.get(j.user);
                let muterole;
                
                if(!guildData.muterole) {
                    try {
                    muterole = await message.guild.roles.create({
                        data: {
                        name: `Muted`,
                        color: `BLACK`
                    }});
            
                    guildData.muterole = muterole.id;
                    guildData.save();
            
                    message.guild.channels.cache.forEach(async c => {
                        await c.createOverwrite(muterole, { SEND_MESSAGES: false, ADD_REACTIONS: false });
                    });
                    } catch(e) {
                    console.log(e.stack);
                    }
                } else muterole = message.guild.roles.cache.get(guildData.muterole);

                if(member.hasPermission("ADMINISTRATOR")) return;
                if(member.roles.cache.has(muterole.id)) return;
                
                await member.roles.add(muterole);
            }
        });

        message.channel.send(embeds.complete(`Successfuly **muted all members** that joined in the past **${time}**.`));
    }
}