const {
    processOperation,
    isOperation
} = require('../lib/operations');

const {
    DEBUG,
    PORT,
    HOST,
    getRandomId,
    serverLog
} = require('../lib/configuration');

const netLib = require('net');
const server = new netLib.Server();

try {
    let allSockets = [];

    let processMessage = ({
        command,
        message
    }, socket) => {
        if (isOperation(command)) {
            const {
                finalResult,
                allInputsValid
            } = processOperation(command, message);

            if (allInputsValid) {
                socket.write(`[${String(command).toUpperCase()}] ${socket.name}: ${finalResult}`);
            } else {
                socket.write(`[${String(command).toUpperCase()}] ${socket.name}: Invalid parameters, please only send numbers`);
            }
        }

        if (command == 'name') {
            socket.name = message;
            serverLog(`[ACTION] ${socket.id} has the username ${message}`, {
                isDebugOnly: true
            });
        }
    }

    server.listen(PORT, function () {
        serverLog(`Server on ${HOST}:${PORT}`);
    });

    server.on('connection', function (socket) {
        let id = getRandomId();
        serverLog(`New client!`, {
            isDebugOnly: true
        });

        socket.id = id;
        socket.write('You are connected');

        allSockets.push(socket);

        socket.on('data', function (chunk) {
            let receivedInfo = chunk.toString();
            serverLog(`Data received: ${receivedInfo}`, {
                isDebugOnly: true
            });

            try {
                let messageObject = JSON.parse(receivedInfo);
                processMessage(messageObject, socket)
            } catch (e) {
                serverLog(`Error reading object`);
            }
        });

        socket.on('end', function () {
            serverLog(`Bye, ${socket.name} see you`, {
                isDebugOnly: true
            });
        });

        socket.on('error', function (err) {
            serverLog(`Error: ${err}`);
        });
    });
} catch (e) {
    console.log("Error running the server." + JSON.stringify(e))
}