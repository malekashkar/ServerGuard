module.exports = async(client, guild) => {
    client.models.config.create({
        _id: guild.id,
        prefix: "*"
    });
}