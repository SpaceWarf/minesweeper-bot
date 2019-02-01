const Discord = require('discord.js');
const auth = require('./auth.json');
const client = new Discord.Client();

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
    const args = msgArray.slice(1);

    switch (command) {
        case 'help':
            sendHelp(message.channel);
            break;
        case 'minesweeper':
            if (inputIsValid(args)) {
                sendPuzzle(message.channel, args);
            } else {
                sendError(message.channel);
            }
            break;
        default:
    }
};

const inputIsValid = args => {
    return args[0] * args[1] <= 197 &&
        args[2] <= args[0] * args[1];
};

const sendError = channel => {
    channel.send('Error: invalid input. :rage:');
};

const sendHelp = channel => {
    const p1 = 'Need help? Just use !minesweeper to generate a puzzle.';
    const p2 = 'The command takes grid dimensions and mine quantity, in this order.';
    const p3 = 'Try !minesweeper 5 7 10 to generate a 5x7 grid with 10 mines on it.';
    const p4 = 'Due to Discord limitations, your grid cannot contain more than 197 cells.';
    channel.send(`${p1}\n${p2}\n${p3}\n${p4}`);
};

const sendPuzzle = (channel, args) => {
    const emptyGrid = generateEmptyGrid(args[0], args[1]);
    const minedGrid = addMines(emptyGrid, args[2]);
    const filledGrid = fillNumbers(minedGrid);
    channel.send('Here is your puzzle! Goodluck :wink:\n' + formatPuzzle(filledGrid));
};

const generateEmptyGrid = (width, height) => {
    const emptyRow = [];
    const emptyGrid = [];
    for (let i = 0; i < width; i++) {
        emptyRow.push(0);
    }
    for (let i = 0; i < height; i++) {
        // The spread operator is used to break references between the empty row objects
        emptyGrid.push([...emptyRow]);
    }
    return emptyGrid;
};

const addMines = (emptyGrid, minesQty) => {
    const minedGrid = emptyGrid;
    for (let i = 0; i < minesQty; i++) {
        let mineRow;
        let mineCol;
        do {
            mineRow = generateRandomNumber(emptyGrid.length);
            mineCol = generateRandomNumber(emptyGrid[0].length);
        } while (typeof minedGrid[mineRow][mineCol] === 'string');
        minedGrid[mineRow][mineCol] = 'X';
    }
    return minedGrid;
};

const fillNumbers = minedGrid => {
    const filledGrid = minedGrid;
    for (let i = 0; i < filledGrid.length; i++) {
        for (let j = 0; j < filledGrid[0].length; j++) {
            if (typeof filledGrid[i][j] === 'string') {
                increaseAdjacentNumbers(i, j, filledGrid);
            }
        }
    }
    return filledGrid;
};

const increaseAdjacentNumbers = (row, col, filledGrid) => {
    if (filledGrid[row + 1]) {
        filledGrid[row + 1][col] += 1;
        if (typeof filledGrid[row + 1][col + 1] === 'number') {
            filledGrid[row + 1][col + 1] += 1;
        }
        if (typeof filledGrid[row + 1][col - 1] === 'number') {
            filledGrid[row + 1][col - 1] += 1;
        }
    }
    if (filledGrid[row - 1]) {
        filledGrid[row - 1][col] += 1;
        if (typeof filledGrid[row - 1][col + 1] === 'number') {
            filledGrid[row - 1][col + 1] += 1;
        }
        if (typeof filledGrid[row - 1][col - 1] === 'number') {
            filledGrid[row - 1][col - 1] += 1;
        }
    }
    if (typeof filledGrid[row][col + 1] === 'number') {
        filledGrid[row][col + 1] += 1;
    }
    if (typeof filledGrid[row][col - 1] === 'number') {
        filledGrid[row][col - 1] += 1;
    }
};

const generateRandomNumber = max => {
    return Math.floor(Math.random() * Math.floor(max));
};

const formatPuzzle = puzzleGrid => {
    let formattedPuzzle = "";
    puzzleGrid.forEach(row => {
        row.forEach(cell => {
            formattedPuzzle += `||${getEmoji(cell)}||`
        });
        formattedPuzzle += '\n';
    });
    return formattedPuzzle
};

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
        case 4:
            return ":four:";
        case 5:
            return ":five:";
        case 6:
            return ":six:";
        case 7:
            return ":seven:";
        case 8:
            return ":eight:";
        default:
            return ":bomb:";
    }
};

client.login(auth.token);