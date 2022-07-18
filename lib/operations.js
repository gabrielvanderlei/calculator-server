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

    if (isSum) {
        operationResult += numberInput;
    }

    if (isSubtraction) {
        operationResult -= numberInput;
    }

    if (isDivision) {
        operationResult /= numberInput;
    }

    if (isMultiplication) {
        operationResult *= numberInput;
    }

    return operationResult
}

let processOperation = (command, message) => {
    let isMultiplication = (command == 'multiplication' || command == '*')
    let isDivision = (command == 'division' || command == '/')
    let isFirstValueOne = isMultiplication || isDivision;

    let messageParameters = message.split(' ');
    let allInputsValid = true;
    let finalResult = isFirstValueOne ? 1 : 0;

    messageParameters.map((numberInput) => {
        let isValidInput = isNaN(Number(numberInput));

        if (isValidInput) {
            allInputsValid = false;
        } else {
            finalResult = setOperationResult(command, finalResult, Number(numberInput));
        }
    })

    return {
        allInputsValid,
        finalResult
    }
}

module.exports = {
    setOperationResult,
    isOperation,
    processOperation
}