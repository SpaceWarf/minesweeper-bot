const Discord = require('discord.js');
const auth = require('./auth.json');
const client = new Discord.Client();

const defaultPuzzle = [
    [1, 1, 1, 'X', 1],
    ['X', 2, 2, 3, 2],
    [1, 3, 'X', 3, 'X'],
    [0, 2, 'X', 3, 1],
    [0, 1, 1, 1, 0]
];

client.on('ready', () => {
    console.log("Connected as " + client.user.tag);
});

client.on('message', (receivedMessage) => {
    if (receivedMessage.content.startsWith("!")) {
        processCommand(receivedMessage);
    }
});

const processCommand = message => {
    const msgArray = message.content.substr(1).split(" ");
    const command = msgArray[0];
    const arguments = msgArray.slice(1);

    switch (command) {
        case 'help':
            sendHelp(message.channel);
            break;
        case 'minesweeper':
            sendPuzzle(message.channel, arguments);
            break;
        default:
    }
};

const sendHelp = channel => {
    channel.send('Need help? Just type !minesweeper to generate a puzzle.');
};

const sendPuzzle = (channel, arguments) => {
    let formattedPuzzle = "";
    defaultPuzzle.forEach(row => {
        row.forEach(cell => {
            formattedPuzzle += `||${getEmoji(cell)}||`
        });
        formattedPuzzle += '\n';
    });
    channel.send('Here is your puzzle! Goodluck :wink:\n' + formattedPuzzle);
}

const getEmoji = character => {
    switch (character) {
        case 0:
            return ":zero:";
        case 1:
            return ":one:";
        case 2:
            return ":two:";
        case 3:
            return ":three:";
        case "X":
            return ":regional_indicator_x:";
        default:
            return "";
    }
}

client.login(auth.token);