const {
    DEBUG,
    PORT,
    HOST,
    clientLog
} = require('../lib/configuration');

const netLib = require('net');
const client = new netLib.Socket();

try {
    const readline = require('readline');
    const rl = readline.createInterface(process.stdin, process.stdout);

    let processMessage = (command, message) => {
        clientLog(`Command: ${command} / Message: ${message}`, {
            isDebugOnly: true
        });

        if (command == 'quit') {
            clientLog('Bye');
            client.end();
            rl.close();
        } else {
            client.write(JSON.stringify({
                command,
                message
            }));
        }
    }

    const startProcessing = () => {
        clientLog(`Message format: [command] content.`)
        clientLog(``)
        clientLog(`Command examples.`)
        clientLog(`> sum 1 1`)
        clientLog(`> + 1 1`)
        clientLog(`> subtraction 1 1`)
        clientLog(`> - 1 1`)
        clientLog(`> division 1 1`)
        clientLog(`> / 1 1`)
        clientLog(`> multiplication 1 1`)
        clientLog(`> * 1 1`)
        clientLog(`> quit now`)
        clientLog(``)

        rl.on('line', (message) => {
            let messageSplitted = message.split(' ');

            if (messageSplitted.length > 1) {
                let command = messageSplitted.shift();
                let message = messageSplitted.join(' ');

                processMessage(command, message);
            } else {
                clientLog(`Message format: [command] content. Example: + 1 1`)
            }
        });
    }

    client.connect({
        port: PORT,
        host: HOST
    }, function () {
        clientLog(`Connected!`);

        rl.question('What is your username? ', (username) => {
            processMessage('name', username)
            startProcessing();

            client.on('data', function (chunk) {
                console.log(`[SERVER] ${chunk.toString()}.`);
            });
        });
    });

    client.on('end', function () {
        clientLog('Disconnected');
        client.end();
        rl.close();
    });

    client.on('error', function () {
        clientLog('Error, please verify if the server is online.');
    });
} catch (e) {
    console.log("Error running the client, please verify if the server is online.")
}