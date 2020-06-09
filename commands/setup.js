const embeds = require("../utils/embed")
const ms = require("ms");

exports.run = async(client, message, args) => {
    let premiumData = client.models.premium.findById(message.guild.id);
    let options = [`mentions`, `spam`];

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

                            if(action === `tm`) {
                                let fifth = await message.channel.send(embeds.question(`How long should the tempmute last?`, `Please provide a time in between **1m and 24h.**`));
                                let collector = message.channel.createMessageCollector(m => m.author.id === message.author.id && ms(m.content) >= 60000 && ms(m.content) <= 24 * 60 * 60 * 1000, { max: 1 });
                                collector.on('collect', async m => {
                                    fifth.delete(); m.delete();
                                    tempmutetime = m.content;

                                    let sixth = await message.channel.send(embeds.question(`Would you want the bot to ping a role when the action has occurred?`, `Tag a role if you do, reply with "no" if you don't.`));
                                    let collector = message.channel.createMessageCollector(m => m.author.id === message.author.id, { max: 1 });
                                    collector.on('collect', async m => {
                                        sixth.delete(); m.delete();
                                        let ping = m.content;
        
                                        let mentionSpam = await client.models.mentionspam.findById(message.guild.id);
        
                                        if(!mentionSpam) {
                                            client.models.mentionspam.create({
                                                _id: message.guild.id,
                                                type: `user`,
                                                amount: amount,
                                                time: ms(time),
                                                outcome: action,
                                                ping: ping
                                            });
                                        } else {
                                            mentionSpam._id = message.guild.id;
                                            mentionSpam.type = `user`;
                                            mentionnSpam.amount = amount;
                                            mentionnSpam.time = ms(time);
                                            mentionnSpam.outcome = action;
                                            mentionnSpam.ping = ping;
                                            mentionnSpam.save();
                                        }
                                    });
                                });
                            } else {
                                let sixth = await message.channel.send(embeds.question(`Would you want the bot to ping a role when the action has occurred?`, `Tag a role if you do, reply with "no" if you don't.`));
                                let collector = message.channel.createMessageCollector(m => m.author.id === message.author.id && [], { max: 1 });
                                collector.on('collect', async m => {
                                    sixth.delete(); m.delete();
                                    let ping = m.content;
    
                                    let mentionSpam = await client.models.mentionspam.findById(message.guild.id);
    
                                    if(!mentionSpam) {
                                        client.models.mentionspam.create({
                                            _id: message.guild.id,
                                            type: `user`,
                                            amount: amount,
                                            time: ms(time),
                                            outcome: action,
                                            ping: ping
                                        });
                                    } else {
                                        mentionSpam._id = message.guild.id;
                                        mentionSpam.type = `user`;
                                        mentionnSpam.amount = amount;
                                        mentionnSpam.time = ms(time);
                                        mentionnSpam.outcome = action;
                                        mentionnSpam.ping = ping;
                                        mentionnSpam.save();
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

                            if(action === `tm`) {
                                let fifth = await message.channel.send(embeds.question(`How long should the tempmute last?`, `Please provide a time in between **1m and 24h.**`));
                                let collector = message.channel.createMessageCollector(m => m.author.id === message.author.id && ms(m.content) >= 60000 && ms(m.content) <= 24 * 60 * 60 * 1000, { max: 1 });
                                collector.on('collect', async m => {
                                    fifth.delete(); m.delete();
                                    tempmutetime = m.content;

                                    let sixth = await message.channel.send(embeds.question(`Would you want the bot to ping a role when the action has occurred?`, `Tag a role if you do, reply with "no" if you don't.`));
                                    let collector = message.channel.createMessageCollector(m => m.author.id === message.author.id, { max: 1 });
                                    collector.on('collect', async m => {
                                        sixth.delete(); m.delete();
                                        let ping = m.content;
        
                                        let mentionSpam = await client.models.mentionspam.findById(message.guild.id);
        
                                        if(!mentionSpam) {
                                            client.models.mentionspam.create({
                                                _id: message.guild.id,
                                                type: `role`,
                                                amount: amount,
                                                time: ms(time),
                                                outcome: action,
                                                ping: ping
                                            });
                                        } else {
                                            mentionSpam._id = message.guild.id;
                                            mentionSpam.type = `role`;
                                            mentionnSpam.amount = amount;
                                            mentionnSpam.time = ms(time);
                                            mentionnSpam.outcome = action;
                                            mentionnSpam.ping = ping;
                                            mentionnSpam.save();
                                        }
                                    });
                                });
                            } else {
                                let sixth = await message.channel.send(embeds.question(`Would you want the bot to ping a role when the action has occurred?`, `Tag a role if you do, reply with "no" if you don't.`));
                                let collector = message.channel.createMessageCollector(m => m.author.id === message.author.id && [], { max: 1 });
                                collector.on('collect', async m => {
                                    sixth.delete(); m.delete();
                                    let ping = m.content;
    
                                    let mentionSpam = await client.models.mentionspam.findById(message.guild.id);
    
                                    if(!mentionSpam) {
                                        client.models.mentionspam.create({
                                            _id: message.guild.id,
                                            type: `role`,
                                            amount: amount,
                                            time: ms(time),
                                            outcome: action,
                                            ping: ping
                                        });
                                    } else {
                                        mentionSpam._id = message.guild.id;
                                        mentionSpam.type = `role`;
                                        mentionnSpam.amount = amount;
                                        mentionnSpam.time = ms(time);
                                        mentionnSpam.outcome = action;
                                        mentionnSpam.ping = ping;
                                        mentionnSpam.save();
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

                            if(action === `tm`) {
                                let fifth = await message.channel.send(embeds.question(`How long should the tempmute last?`, `Please provide a time in between **1m and 24h.**`));
                                let collector = message.channel.createMessageCollector(m => m.author.id === message.author.id && ms(m.content) >= 60000 && ms(m.content) <= 24 * 60 * 60 * 1000, { max: 1 });
                                collector.on('collect', async m => {
                                    fifth.delete(); m.delete();
                                    tempmutetime = m.content;

                                    let sixth = await message.channel.send(embeds.question(`Would you want the bot to ping a role when the action has occurred?`, `Tag a role if you do, reply with "no" if you don't.`));
                                    let collector = message.channel.createMessageCollector(m => m.author.id === message.author.id, { max: 1 });
                                    collector.on('collect', async m => {
                                        sixth.delete(); m.delete();
                                        let ping = m.content;
        
                                        let mentionSpam = await client.models.mentionspam.findById(message.guild.id);
        
                                        if(!mentionSpam) {
                                            client.models.mentionspam.create({
                                                _id: message.guild.id,
                                                type: `both`,
                                                amount: amount,
                                                time: ms(time),
                                                outcome: action,
                                                ping: ping
                                            });
                                        } else {
                                            mentionSpam._id = message.guild.id;
                                            mentionSpam.type = `both`;
                                            mentionnSpam.amount = amount;
                                            mentionnSpam.time = ms(time);
                                            mentionnSpam.outcome = action;
                                            mentionnSpam.ping = ping;
                                            mentionnSpam.save();
                                        }
                                    });
                                });
                            } else {
                                let sixth = await message.channel.send(embeds.question(`Would you want the bot to ping a role when the action has occurred?`, `Tag a role if you do, reply with "no" if you don't.`));
                                let collector = message.channel.createMessageCollector(m => m.author.id === message.author.id && [], { max: 1 });
                                collector.on('collect', async m => {
                                    sixth.delete(); m.delete();
                                    let ping = m.content;
    
                                    let mentionSpam = await client.models.mentionspam.findById(message.guild.id);
    
                                    if(!mentionSpam) {
                                        client.models.mentionspam.create({
                                            _id: message.guild.id,
                                            type: `both`,
                                            amount: amount,
                                            time: ms(time),
                                            outcome: action,
                                            ping: ping
                                        });
                                    } else {
                                        mentionSpam._id = message.guild.id;
                                        mentionSpam.type = `both`;
                                        mentionnSpam.amount = amount;
                                        mentionnSpam.time = ms(time);
                                        mentionnSpam.outcome = action;
                                        mentionnSpam.ping = ping;
                                        mentionnSpam.save();
                                    }
                                });
                            }
                        });
                    });
                });
            }
        });
    }
}