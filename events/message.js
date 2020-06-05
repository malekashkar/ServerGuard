module.exports = async (client, message) => {
  if (message.author.bot) return;

  let guildData = await client.models.config.findById(message.guild.id);
  if(message.content.indexOf(guildData.prefix) !== 0) return;

  const args = message.content.slice(guildData.prefix.length).trim().split(/ +/g);
  const command = args.shift().toLowerCase();
  const cmd = client.commands.get(command);
  if(!cmd) return;

  cmd.run(client, message, args);
};