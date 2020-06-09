const Discord = require("discord.js");
const embeds = require("../utils/embed");
const ms = require("ms");

exports.run = async(client, message, args) => {
    let premiumData = client.models.premium.findById(message.guild.id);
    let options = [`massmention`, `repeatedmsg`];

    if(args[0] === options[0]) {
        
        let first = await message.channel.send(embeds.question(`What would you like to detect?`, `\n\n🟢 Detected User Mentions\n🔵 Detect Role Mentions\n🔴 Detect Both`));
        first.react("🟢"); first.react("🔵"); first.react("🔴");
        let fCollector = first.createReactionCollector((reaction, user) => ["🟢", "🔵", "🔴"].includes(reaction.emoji.name) && user.id === message.author.id, { max: 1 });

        fCollector.on('collect', async(reaction, user) => {
            first.delete();

            if(reaction.emoji.name === "🟢") {

                let second = await message.channel.send(embeds.question(`How many user mentions should be sent before an action happens?`, `Please provide a number in between 1-10.`));
                let collector = message.channel.createMessageCollector(m => m.author.id === message.author.id && parseInt(m.content) >= 1 && parseInt(m.content) <= 10, { max: 1 });
                collector.on('collect', async m => {
                    second.delete(); m.delete();
                    let amount = m.content;

                    let timeMax;
                    if(!premiumData) timeMax = 1;
                    else timeMax = 5;

                    let third = await message.channel.send(embeds.question(`In how much time would the bot reset the timer for the amount of mentions?`, `Please provide a time in between **30s and ${timeMax}m.**`));
                    let collector = message.channel.createMessageCollector(m => m.author.id === message.author.id && ms(m.content) >= 30000 && ms(m.content) <= timeMax * 60 * 1000, { max: 1 });
                    collector.on('collect', async m => {
                        third.delete(); m.delete();
                        let time = m.content;

                        let fourth = await message.channel.send(embeds.question(`What action will occur if the bot detects the correct number of mentions?`, `s: Server Lockdown\nc: Channel Lockdown\nb: Ban\n k: Kick\nm: Mute\ntm: Tempmute`));
                        let collector = message.channel.createMessageCollector(m => m.author.id === message.author.id && ["s", "c", "b", "k", "m", "tm"].includes(m.content), { max: 1 });
                        collector.on('collect', async m => {
                            fourth.delete(); m.delete();
                            let action = m.content;
                            let tempmutetime;

                            if(action !== `tm`) tempmutetime = 0;

                            if(action === `tm`) {
                                let fifth = await message.channel.send(embeds.question(`How long should the tempmute last?`, `Please provide a time in between **1m and 24h.**`));
                                let collector = message.channel.createMessageCollector(m => m.author.id === message.author.id && ms(m.content) >= 60000 && ms(m.content) <= 24 * 60 * 60 * 1000, { max: 1 });
                                collector.on('collect', async m => {
                                    fifth.delete(); m.delete();
                                    tempmutetime = m.content;

                                    let sixth = await message.channel.send(embeds.question(`Would you want the bot to ping a role when the action has occurred?`, `Tag a role if you do, reply with "no" if you don't.`));
                                    let collector = message.channel.createMessageCollector(m => m.author.id === message.author.id && m.mentions.roles.first() || m.content === "no", { max: 1 });
                                    collector.on('collect', async m => {
                                        sixth.delete(); m.delete();
                                        
                                        let ping;
                                        if(m.mentions.roles.first()) ping = m.mentions.roles.first();
                                        else ping = "none";
        
                                        let mentionSpam = await client.models.mentionspam.findById(message.guild.id);
        
                                        if(!mentionSpam) {
                                            client.models.mentionspam.create({
                                                _id: message.guild.id,
                                                type: `user`,
                                                amount: amount,
                                                time: ms(time),
                                                outcome: action,
                                                ping: ping,
                                                tm: tempmutetime
                                            });

                                        let complete = new Discord.MessageEmbed()
                                        .setTitle(`Complete`)
                                        .setColor(client.config.color)
                                        .setDescription(`Mass mention setup created.`)
                                        .addField(`Type`, `User Mentions`, true)
                                        .addField(`Amount of Mentions`, amount, true)
                                        .addField(`Counter Reset Time`, time, true)
                                        .addField(`Action on mentions`, verificationName(action), true)
                                        .addField(`Ping a role`, ping, true)
                                        message.channel.send(complete);
                                        } else {
                                            mentionSpam._id = message.guild.id;
                                            mentionSpam.type = `user`;
                                            mentionSpam.amount = amount;
                                            mentionSpam.time = ms(time);
                                            mentionSpam.outcome = action;
                                            mentionSpam.ping = ping;
                                            mentionSpam.tm = tempmutetime;
                                            mentionSpam.save();

                                        let complete = new Discord.MessageEmbed()
                                        .setTitle(`Complete`)
                                        .setColor(client.config.color)
                                        .setDescription(`Mass mention setup updated.`)
                                        .addField(`Type`, `User Mentions`, true)
                                        .addField(`Amount of Mentions`, amount, true)
                                        .addField(`Counter Reset Time`, time, true)
                                        .addField(`Action on mentions`, verificationName(action), true)
                                        .addField(`Ping a role`, ping, true)
                                        message.channel.send(complete);
                                        }
                                    });
                                });
                            } else {
                                let sixth = await message.channel.send(embeds.question(`Would you want the bot to ping a role when the action has occurred?`, `Tag a role if you do, reply with "no" if you don't.`));
                                let collector = message.channel.createMessageCollector(m => m.author.id === message.author.id && [], { max: 1 });
                                collector.on('collect', async m => {
                                    sixth.delete(); m.delete();
                                    
                                    let ping;
                                    if(m.mentions.roles.first()) ping = m.mentions.roles.first();
                                    else ping = "none";
    
                                    let mentionSpam = await client.models.mentionspam.findById(message.guild.id);
    
                                    if(!mentionSpam) {
                                        client.models.mentionspam.create({
                                            _id: message.guild.id,
                                            type: `user`,
                                            amount: amount,
                                            time: ms(time),
                                            outcome: action,
                                            ping: ping,
                                            tm: tempmutetime
                                        });

                                    let complete = new Discord.MessageEmbed()
                                    .setTitle(`Complete`)
                                    .setColor(client.config.color)
                                    .setDescription(`Mass mention setup created.`)
                                    .addField(`Type`, `User Mentions`, true)
                                    .addField(`Amount of Mentions`, amount, true)
                                    .addField(`Counter Reset Time`, time, true)
                                    .addField(`Action on mentions`, verificationName(action), true)
                                    .addField(`Ping a role`, ping, true)
                                    message.channel.send(complete);
                                    } else {
                                        mentionSpam._id = message.guild.id;
                                        mentionSpam.type = `user`;
                                        mentionSpam.amount = amount;
                                        mentionSpam.time = ms(time);
                                        mentionSpam.outcome = action;
                                        mentionSpam.ping = ping;
                                        mentionSpam.tm = tempmutetime;
                                        mentionSpam.save();

                                    let complete = new Discord.MessageEmbed()
                                    .setTitle(`Complete`)
                                    .setColor(client.config.color)
                                    .setDescription(`Mass mention setup updated.`)
                                    .addField(`Type`, `User Mentions`, true)
                                    .addField(`Amount of Mentions`, amount, true)
                                    .addField(`Counter Reset Time`, time, true)
                                    .addField(`Action on mentions`, verificationName(action), true)
                                    .addField(`Ping a role`, ping, true)
                                    message.channel.send(complete);
                                    }
                                });
                            }
                        });
                    });
                });

            } else if(reaction.emoji.name === "🔵") {

                let second = await message.channel.send(embeds.question(`How many role/user mentions should be sent before an action happens?`, `Please provide a number in between 1-10.`));
                let collector = message.channel.createMessageCollector(m => m.author.id === message.author.id && parseInt(m.content) >= 1 && parseInt(m.content) <= 10, { max: 1 });
                collector.on('collect', async m => {
                    second.delete(); m.delete();
                    let amount = m.content;

                    let timeMax;
                    if(!premiumData) timeMax = 1;
                    else timeMax = 5;

                    let third = await message.channel.send(embeds.question(`In how much time would the bot reset the timer for the amount of mentions?`, `Please provide a time in between **30s and ${timeMax}m.**`));
                    let collector = message.channel.createMessageCollector(m => m.author.id === message.author.id && ms(m.content) >= 30000 && ms(m.content) <= timeMax * 60 * 1000, { max: 1 });
                    collector.on('collect', async m => {
                        third.delete(); m.delete();
                        let time = m.content;

                        let fourth = await message.channel.send(embeds.question(`What action will occur if the bot detects the correct number of mentions?`, `s: Server Lockdown\nc: Channel Lockdown\nb: Ban\n k: Kick\nm: Mute\ntm: Tempmute`));
                        let collector = message.channel.createMessageCollector(m => m.author.id === message.author.id && ["s", "c", "b", "k", "m", "tm"].includes(m.content), { max: 1 });
                        collector.on('collect', async m => {
                            fourth.delete(); m.delete();
                            let action = m.content;
                            let tempmutetime;

                            if(action !== `tm`) tempmutetime = 0;

                            if(action === `tm`) {
                                let fifth = await message.channel.send(embeds.question(`How long should the tempmute last?`, `Please provide a time in between **1m and 24h.**`));
                                let collector = message.channel.createMessageCollector(m => m.author.id === message.author.id && ms(m.content) >= 60000 && ms(m.content) <= 24 * 60 * 60 * 1000, { max: 1 });
                                collector.on('collect', async m => {
                                    fifth.delete(); m.delete();
                                    tempmutetime = m.content;

                                    let sixth = await message.channel.send(embeds.question(`Would you want the bot to ping a role when the action has occurred?`, `Tag a role if you do, reply with "no" if you don't.`));
                                    let collector = message.channel.createMessageCollector(m => m.author.id === message.author.id && m.mentions.roles.first() || m.content === "no", { max: 1 });
                                    collector.on('collect', async m => {
                                        sixth.delete(); m.delete();
                                        
                                        let ping;
                                        if(m.mentions.roles.first()) ping = m.mentions.roles.first();
                                        else ping = "none";
        
                                        let mentionSpam = await client.models.mentionspam.findById(message.guild.id);
        
                                        if(!mentionSpam) {
                                            client.models.mentionspam.create({
                                                _id: message.guild.id,
                                                type: `role`,
                                                amount: amount,
                                                time: ms(time),
                                                outcome: action,
                                                ping: ping,
                                                tm: tempmutetime
                                            });

                                        let complete = new Discord.MessageEmbed()
                                        .setTitle(`Complete`)
                                        .setColor(client.config.color)
                                        .setDescription(`Mass mention setup created.`)
                                        .addField(`Type`, `Role Mentions`, true)
                                        .addField(`Amount of Mentions`, amount, true)
                                        .addField(`Counter Reset Time`, time, true)
                                        .addField(`Action on mentions`, verificationName(action), true)
                                        .addField(`Ping a role`, ping, true)
                                        message.channel.send(complete);
                                        } else {
                                            mentionSpam._id = message.guild.id;
                                            mentionSpam.type = `role`;
                                            mentionSpam.amount = amount;
                                            mentionSpam.time = ms(time);
                                            mentionSpam.outcome = action;
                                            mentionSpam.ping = ping;
                                            mentionSpam.tm = tempmutetime;
                                            mentionSpam.save();

                                        let complete = new Discord.MessageEmbed()
                                        .setTitle(`Complete`)
                                        .setColor(client.config.color)
                                        .setDescription(`Mass mention setup updated.`)
                                        .addField(`Type`, `Role Mentions`, true)
                                        .addField(`Amount of Mentions`, amount, true)
                                        .addField(`Counter Reset Time`, time, true)
                                        .addField(`Action on mentions`, verificationName(action), true)
                                        .addField(`Ping a role`, ping, true)
                                        message.channel.send(complete);
                                        }
                                    });
                                });
                            } else {
                                let sixth = await message.channel.send(embeds.question(`Would you want the bot to ping a role when the action has occurred?`, `Tag a role if you do, reply with "no" if you don't.`));
                                let collector = message.channel.createMessageCollector(m => m.author.id === message.author.id && [], { max: 1 });
                                collector.on('collect', async m => {
                                    sixth.delete(); m.delete();
                                    
                                    let ping;
                                    if(m.mentions.roles.first()) ping = m.mentions.roles.first();
                                    else ping = "none";
    
                                    let mentionSpam = await client.models.mentionspam.findById(message.guild.id);
    
                                    if(!mentionSpam) {
                                        client.models.mentionspam.create({
                                            _id: message.guild.id,
                                            type: `role`,
                                            amount: amount,
                                            time: ms(time),
                                            outcome: action,
                                            ping: ping,
                                            tm: tempmutetime
                                        });

                                    let complete = new Discord.MessageEmbed()
                                    .setTitle(`Complete`)
                                    .setColor(client.config.color)
                                    .setDescription(`Mass mention setup created.`)
                                    .addField(`Type`, `Role Mentions`, true)
                                    .addField(`Amount of Mentions`, amount, true)
                                    .addField(`Counter Reset Time`, time, true)
                                    .addField(`Action on mentions`, verificationName(action), true)
                                    .addField(`Ping a role`, ping, true)
                                    message.channel.send(complete);
                                    } else {
                                        mentionSpam._id = message.guild.id;
                                        mentionSpam.type = `role`;
                                        mentionSpam.amount = amount;
                                        mentionSpam.time = ms(time);
                                        mentionSpam.outcome = action;
                                        mentionSpam.ping = ping;
                                        mentionSpam.tm = tempmutetime;
                                        mentionSpam.save();

                                    let complete = new Discord.MessageEmbed()
                                    .setTitle(`Complete`)
                                    .setColor(client.config.color)
                                    .setDescription(`Mass mention setup updated.`)
                                    .addField(`Type`, `Role Mentions`, true)
                                    .addField(`Amount of Mentions`, amount, true)
                                    .addField(`Counter Reset Time`, time, true)
                                    .addField(`Action on mentions`, verificationName(action), true)
                                    .addField(`Ping a role`, ping, true)
                                    message.channel.send(complete);
                                    }
                                });
                            }
                        });
                    });
                });

            } else {

                let second = await message.channel.send(embeds.question(`How many role mentions should be sent before an action happens?`, `Please provide a number in between 1-10.`));
                let collector = message.channel.createMessageCollector(m => m.author.id === message.author.id && parseInt(m.content) >= 1 && parseInt(m.content) <= 10, { max: 1 });
                collector.on('collect', async m => {
                    second.delete(); m.delete();
                    let amount = m.content;

                    let timeMax;
                    if(!premiumData) timeMax = 1;
                    else timeMax = 5;

                    let third = await message.channel.send(embeds.question(`In how much time would the bot reset the timer for the amount of mentions?`, `Please provide a time in between **30s and ${timeMax}m.**`));
                    let collector = message.channel.createMessageCollector(m => m.author.id === message.author.id && ms(m.content) >= 30000 && ms(m.content) <= timeMax * 60 * 1000, { max: 1 });
                    collector.on('collect', async m => {
                        third.delete(); m.delete();
                        let time = m.content;

                        let fourth = await message.channel.send(embeds.question(`What action will occur if the bot detects the correct number of mentions?`, `s: Server Lockdown\nc: Channel Lockdown\nb: Ban\n k: Kick\nm: Mute\ntm: Tempmute`));
                        let collector = message.channel.createMessageCollector(m => m.author.id === message.author.id && ["s", "c", "b", "k", "m", "tm"].includes(m.content), { max: 1 });
                        collector.on('collect', async m => {
                            fourth.delete(); m.delete();
                            let action = m.content;
                            let tempmutetime;

                            if(action !== `tm`) tempmutetime = 0;

                            if(action === `tm`) {
                                let fifth = await message.channel.send(embeds.question(`How long should the tempmute last?`, `Please provide a time in between **1m and 24h.**`));
                                let collector = message.channel.createMessageCollector(m => m.author.id === message.author.id && ms(m.content) >= 60000 && ms(m.content) <= 24 * 60 * 60 * 1000, { max: 1 });
                                collector.on('collect', async m => {
                                    fifth.delete(); m.delete();
                                    tempmutetime = m.content;

                                    let sixth = await message.channel.send(embeds.question(`Would you want the bot to ping a role when the action has occurred?`, `Tag a role if you do, reply with "no" if you don't.`));
                                    let collector = message.channel.createMessageCollector(m => m.author.id === message.author.id && m.mentions.roles.first() || m.content === "no", { max: 1 });
                                    collector.on('collect', async m => {
                                        sixth.delete(); m.delete();

                                        let ping;
                                        if(m.mentions.roles.first()) ping = m.mentions.roles.first();
                                        else ping = "none";
        
                                        let mentionSpam = await client.models.mentionspam.findById(message.guild.id);
        
                                        if(!mentionSpam) {
                                            client.models.mentionspam.create({
                                                _id: message.guild.id,
                                                type: `both`,
                                                amount: amount,
                                                time: ms(time),
                                                outcome: action,
                                                ping: ping,
                                                tm: tempmutetime
                                            });

                                        let complete = new Discord.MessageEmbed()
                                        .setTitle(`Complete`)
                                        .setColor(client.config.color)
                                        .setDescription(`Mass mention setup created.`)
                                        .addField(`Type`, `Both Mentions`, true)
                                        .addField(`Amount of Mentions`, amount, true)
                                        .addField(`Counter Reset Time`, time, true)
                                        .addField(`Action on mentions`, verificationName(action), true)
                                        .addField(`Ping a role`, ping, true)
                                        message.channel.send(complete);
                                        } else {
                                            mentionSpam._id = message.guild.id;
                                            mentionSpam.type = `both`;
                                            mentionSpam.amount = amount;
                                            mentionSpam.time = ms(time);
                                            mentionSpam.outcome = action;
                                            mentionSpam.ping = ping;
                                            mentionSpam.tm = tempmutetime;
                                            mentionSpam.save();

                                        let complete = new Discord.MessageEmbed()
                                        .setTitle(`Complete`)
                                        .setColor(client.config.color)
                                        .setDescription(`Mass mention setup updated.`)
                                        .addField(`Type`, `Both Mentions`, true)
                                        .addField(`Amount of Mentions`, amount, true)
                                        .addField(`Counter Reset Time`, time, true)
                                        .addField(`Action on mentions`, verificationName(action), true)
                                        .addField(`Ping a role`, ping, true)
                                        message.channel.send(complete);
                                        }
                                    });
                                });
                            } else {
                                let sixth = await message.channel.send(embeds.question(`Would you want the bot to ping a role when the action has occurred?`, `Tag a role if you do, reply with "no" if you don't.`));
                                let collector = message.channel.createMessageCollector(m => m.author.id === message.author.id && [], { max: 1 });
                                collector.on('collect', async m => {
                                    sixth.delete(); m.delete();
                                    
                                    let ping;
                                    if(m.mentions.roles.first()) ping = m.mentions.roles.first();
                                    else ping = "none";
    
                                    let mentionSpam = await client.models.mentionspam.findById(message.guild.id);
    
                                    if(!mentionSpam) {
                                        client.models.mentionspam.create({
                                            _id: message.guild.id,
                                            type: `both`,
                                            amount: amount,
                                            time: ms(time),
                                            outcome: action,
                                            ping: ping,
                                            tm: tempmutetime
                                        });

                                    let complete = new Discord.MessageEmbed()
                                    .setTitle(`Complete`)
                                    .setColor(client.config.color)
                                    .setDescription(`Mass mention setup created.`)
                                    .addField(`Type`, `Both Mentions`, true)
                                    .addField(`Amount of Mentions`, amount, true)
                                    .addField(`Counter Reset Time`, time, true)
                                    .addField(`Action on mentions`, verificationName(action), true)
                                    .addField(`Ping a role`, ping, true)
                                    message.channel.send(complete);
                                    } else {
                                        mentionSpam._id = message.guild.id;
                                        mentionSpam.type = `both`;
                                        mentionSpam.amount = amount;
                                        mentionSpam.time = ms(time);
                                        mentionSpam.outcome = action;
                                        mentionSpam.ping = ping;
                                        mentionSpam.tm = tempmutetime;
                                        mentionSpam.save();

                                    let complete = new Discord.MessageEmbed()
                                    .setTitle(`Complete`)
                                    .setColor(client.config.color)
                                    .setDescription(`Mass mention setup updated.`)
                                    .addField(`Type`, `Both Mentions`, true)
                                    .addField(`Amount of Messages`, amount, true)
                                    .addField(`Counter Reset Time`, time, true)
                                    .addField(`Action on messages`, verificationName(action), true)
                                    .addField(`Ping a role`, ping, true)
                                    message.channel.send(complete);
                                    }
                                });
                            }
                        });
                    });
                });
            }
        });
    } else if(args[0] === options[1]) {
        let first = await message.channel.send(embeds.question(`How many repeated messages should the bot detect before it locks?`, `Please provide a number in between 1-10.`));
        let collector = message.channel.createMessageCollector(m => m.author.id === message.author.id && parseInt(m.content) >= 1 && parseInt(m.content) <= 10, { max: 1 });
        collector.on('collect', async m => {
            first.delete(); m.delete();
            let amount = m.content;

            let timeMax;
            if(!premiumData) timeMax = 1;
            else timeMax = 5;

            let second = await message.channel.send(embeds.question(`In how much time would the bot reset the timer for the amount of mentions?`, `Please provide a time in between **30s and ${timeMax}m.**`));
            let collector = message.channel.createMessageCollector(m => m.author.id === message.author.id && ms(m.content) >= 30000 && ms(m.content) <= timeMax * 60 * 1000, { max: 1 });
            collector.on('collect', async m => {
                second.delete(); m.delete();
                let time = m.content;

                let third = await message.channel.send(embeds.question(`What action will occur if the bot detects the correct number of mentions?`, `s: Server Lockdown\nc: Channel Lockdown\nb: Ban\n k: Kick\nm: Mute\ntm: Tempmute`));
                let collector = message.channel.createMessageCollector(m => m.author.id === message.author.id && ["s", "c", "b", "k", "m", "tm"].includes(m.content), { max: 1 });
                collector.on('collect', async m => {
                    third.delete(); m.delete();
                    let action = m.content;
                    let tempmutetime;

                    if(action !== `tm`) tempmutetime = 0;

                    if(action === `tm`) {
                        let fourth = await message.channel.send(embeds.question(`How long should the tempmute last?`, `Please provide a time in between **1m and 24h.**`));
                        let collector = message.channel.createMessageCollector(m => m.author.id === message.author.id && ms(m.content) >= 60000 && ms(m.content) <= 24 * 60 * 60 * 1000, { max: 1 });
                        collector.on('collect', async m => {
                            fourth.delete(); m.delete();
                            tempmutetime = m.content;

                            let fifth = await message.channel.send(embeds.question(`Would you want the bot to ping a role when the action has occurred?`, `Tag a role if you do, reply with "no" if you don't.`));
                            let collector = message.channel.createMessageCollector(m => m.author.id === message.author.id && m.mentions.roles.first() || m.content === "no", { max: 1 });
                            collector.on('collect', async m => {
                                fifth.delete(); m.delete();
                                
                                let ping;
                                if(m.mentions.roles.first()) ping = m.mentions.roles.first();
                                else ping = "none";

                                let textSpam = await client.models.textspam.findById(message.guild.id);

                                if(!textSpam) {
                                    client.models.textspam.create({
                                        _id: message.guild.id,
                                        amount: amount,
                                        time: ms(time),
                                        outcome: action,
                                        ping: ping,
                                        tm: tempmutetime
                                    });

                                let complete = new Discord.MessageEmbed()
                                .setTitle(`Complete`)
                                .setColor(client.config.color)
                                .setDescription(`Mass mention setup created.`)
                                .addField(`Amount of Messages`, amount, true)
                                .addField(`Counter Reset Time`, time, true)
                                .addField(`Action on messages`, verificationName(action), true)
                                .addField(`Ping a role`, ping, true)
                                message.channel.send(complete);
                                } else {
                                    textSpam._id = message.guild.id;
                                    textSpam.amount = amount;
                                    textSpam.time = ms(time);
                                    textSpam.outcome = action;
                                    textSpam.ping = ping;
                                    textSpam.tm = tempmutetime;
                                    textSpam.save();

                                let complete = new Discord.MessageEmbed()
                                .setTitle(`Complete`)
                                .setColor(client.config.color)
                                .setDescription(`Text spam setup updated.`)
                                .addField(`Amount of Messages`, amount, true)
                                .addField(`Counter Reset Time`, time, true)
                                .addField(`Action on messages`, verificationName(action), true)
                                .addField(`Ping a role`, ping, true)
                                message.channel.send(complete);
                                }
                            });
                        });
                    } else {
                        let sixth = await message.channel.send(embeds.question(`Would you want the bot to ping a role when the action has occurred?`, `Tag a role if you do, reply with "no" if you don't.`));
                        let collector = message.channel.createMessageCollector(m => m.author.id === message.author.id && [], { max: 1 });
                        collector.on('collect', async m => {
                            sixth.delete(); m.delete();
                            
                            let ping;
                            if(m.mentions.roles.first()) ping = m.mentions.roles.first();
                            else ping = "none";

                            let textSpam = await client.models.textspam.findById(message.guild.id);

                            if(!textSpam) {
                                client.models.textspam.create({
                                    _id: message.guild.id,
                                    amount: amount,
                                    time: ms(time),
                                    outcome: action,
                                    ping: ping,
                                    tm: tempmutetime
                                });

                            let complete = new Discord.MessageEmbed()
                            .setTitle(`Complete`)
                            .setColor(client.config.color)
                            .setDescription(`Mass mention setup created.`)
                            .addField(`Amount of Messages`, amount, true)
                            .addField(`Counter Reset Time`, time, true)
                            .addField(`Action on messages`, verificationName(action), true)
                            .addField(`Ping a role`, ping, true)
                            message.channel.send(complete);
                            } else {
                                textSpam._id = message.guild.id;
                                textSpam.amount = amount;
                                textSpam.time = ms(time);
                                textSpam.outcome = action;
                                textSpam.ping = ping;
                                textSpam.tm = tempmutetime;
                                textSpam.save();

                            let complete = new Discord.MessageEmbed()
                            .setTitle(`Complete`)
                            .setColor(client.config.color)
                            .setDescription(`Mass mention setup updated.`)
                            .addField(`Amount of Messages`, amount, true)
                            .addField(`Counter Reset Time`, time, true)
                            .addField(`Action on messages`, verificationName(action), true)
                            .addField(`Ping a role`, ping, true)
                            message.channel.send(complete);
                            }
                        });
                    }
                });
            });
        });
    }
}

function verificationName(type) {
    let x;
    if(type === `s`) x = `Server Lockdown`;
    if(type === `c`) x = `Channel Lockdown`;
    if(type === `b`) x = `Ban User`;
    if(type === `k`) x = `Kick User`;
    if(type === `m`) x = `Mute User`;
    if(type === `tm`) x = `Tempmute User`;

    return x;
}