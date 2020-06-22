module.exports = async(client, guild) => {
    await client.models.config.create({ _id: guild.id, prefix: "*" });
}