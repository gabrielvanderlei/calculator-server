try{
    const { v4: uuidv4 } = require('uuid');
    const {DEBUG, PORT, HOST} = require('./configuration');

    const netLib = require('net');
    const server = new netLib.Server();

    let allSockets = [];

    const writeBroadcast = (message) => {
        serverLog(`[ALL] ${message}`)
        allSockets.map((socketElement) => {
            socketElement.write(message);
        });
    }

    const serverLog = (message, options = { isDebugOnly: false }) => { 
        if(!options.isDebugOnly || (options.isDebugOnly && DEBUG)){ 
            console.log(`[SERVER] ${message}`) 
        }
    };

    let isOperation = (command) => {
        return (
            (command == 'sum' || command == '+') ||
            (command == 'subtraction' || command == '-') ||
            (command == 'division' || command == '/') ||
            (command == 'multiplication' || command == '*')
        )
    }

    let setOperationResult = (command, finalResult, numberInput) => {
        let isSum = (command == 'sum' || command == '+') 
        let isSubtraction = (command == 'subtraction' || command == '-') 
        let isDivision = (command == 'division' || command == '/')
        let isMultiplication = (command == 'multiplication' || command == '*')
        let operationResult = finalResult;

        if(isSum){
            operationResult += numberInput;
        }
        
        if(isSubtraction){
            operationResult -= numberInput;
        }
        
        if(isDivision){
            operationResult /= numberInput;
        }
        
        if(isMultiplication){
            operationResult *= numberInput;
        }

        return operationResult
    }

    let processMessage = ({ command, message }, socket) => {
        if(isOperation(command)) {
            let isMultiplication = (command == 'multiplication' || command == '*')
            let isDivision = (command == 'division' || command == '/')
            let isFirstValueOne = isMultiplication || isDivision;

            let messageParameters = message.split(' ');
            let allInputsValid = true;
            let finalResult = isFirstValueOne ? 1 : 0;

            messageParameters.map((numberInput) => {
                let isValidInput = isNaN(Number(numberInput));

                if(isValidInput){
                    allInputsValid = false;
                } else {
                    finalResult = setOperationResult(command, finalResult, Number(numberInput));
                }
            })

            if(allInputsValid){
                socket.write(`[SUM] ${socket.name}: ${finalResult}`);
            } else {
                socket.write(`[SUM] ${socket.name}: Invalid parameters, please only send numbers`);
            }
        }

        if(command == 'name') {
            socket.name = message;
            serverLog(`[ACTION] ${socket.id} has the username ${message}`, {isDebugOnly: true});
        }
    }

    server.listen(PORT, function() {
        serverLog(`Server on ${HOST}:${PORT}`);
    });

    server.on('connection', function(socket) {
        let id = uuidv4();
        serverLog(`New client!`, {isDebugOnly: true});

        socket.id = id;
        socket.write('You are connected');

        allSockets.push(socket);

        socket.on('data', function(chunk) {
            let receivedInfo = chunk.toString();
            serverLog(`Data received: ${receivedInfo}`, {isDebugOnly: true});

            try{
                let messageObject = JSON.parse(receivedInfo);
                processMessage(messageObject, socket)
            } catch (e) {
                serverLog(`Error reading object`);
            }
        });

        socket.on('end', function() {
            serverLog(`Bye, ${socket.name} see you`, {isDebugOnly: true});
        });

        socket.on('error', function(err) {
            serverLog(`Error: ${err}`);
        });
    });
} catch(e) {
    console.log("Error running the server." + JSON.stringify(e))
}