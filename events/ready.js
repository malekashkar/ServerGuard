require(`../database/connect`);

module.exports = async(client) => {
    console.log(`The bot has successfuly been turned on!`);

    setInterval(() => {
        require('../utils/unban.js')(client);
        require('../utils/unmute.js')(client);
    }, 10000)
}