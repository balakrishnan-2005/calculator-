document.addEventListener('DOMContentLoaded', () => {
    const previousOperandElement = document.getElementById('previous-operand');
    const currentOperandElement = document.getElementById('current-operand');
    const numberButtons = document.querySelectorAll('.number');
    const operatorButtons = document.querySelectorAll('.operator');
    const clearButton = document.getElementById('clear');
    const deleteButton = document.getElementById('delete');
    const equalsButton = document.getElementById('equals');

    let currentOperand = '0';
    let previousOperand = '';
    let operation = undefined;
    let resetScreen = false;

    function updateDisplay() {
        currentOperandElement.innerText = currentOperand;
        if (operation != null) {
            previousOperandElement.innerText = `${previousOperand} ${getOperationSymbol(operation)}`;
        } else {
            previousOperandElement.innerText = '';
        }
    }

    function getOperationSymbol(operator) {
        switch (operator) {
            case 'add': return '+';
            case 'subtract': return '-';
            case 'multiply': return '×';
            case 'divide': return '÷';
            default: return '';
        }
    }

    function appendNumber(number) {
        if (currentOperand === '0' || resetScreen) {
            currentOperand = number === '.' ? '0.' : number;
            resetScreen = false;
        } else {
            if (number === '.' && currentOperand.includes('.')) return;
            currentOperand += number;
        }
    }

    function chooseOperation(op) {
        if (currentOperand === '' && op !== 'delete') return;
        if (previousOperand !== '') {
            compute();
        }
        operation = op;
        previousOperand = currentOperand;
        resetScreen = true;
    }

    function compute() {
        const prev = parseFloat(previousOperand);
        const current = parseFloat(currentOperand);
        if (isNaN(prev) || isNaN(current)) return;

        let computation;
        switch (operation) {
            case 'add': computation = prev + current; break;
            case 'subtract': computation = prev - current; break;
            case 'multiply': computation = prev * current; break;
            case 'divide':
                if (current === 0) {
                    alert("Cannot divide by zero!");
                    clear();
                    return;
                }
                computation = prev / current; break;
            default: return;
        }

        currentOperand = computation.toString();
        operation = undefined;
        previousOperand = '';
    }

    function clear() {
        currentOperand = '0';
        previousOperand = '';
        operation = undefined;
    }

    function deleteNumber() {
        if (currentOperand.length === 1 || (currentOperand.length === 2 && currentOperand.startsWith('-'))) {
            currentOperand = '0';
        } else {
            currentOperand = currentOperand.slice(0, -1);
        }
    }

    numberButtons.forEach(button => {
        button.addEventListener('click', () => {
            appendNumber(button.innerText);
            updateDisplay();
        });
    });

    operatorButtons.forEach(button => {
        if (button.id !== 'delete' && button.id !== 'equals') {
            button.addEventListener('click', () => {
                chooseOperation(button.id);
                updateDisplay();
            });
        }
    });

    equalsButton.addEventListener('click', () => {
        compute();
        updateDisplay();
    });

    clearButton.addEventListener('click', () => {
        clear();
        updateDisplay();
    });

    deleteButton.addEventListener('click', () => {
        deleteNumber();
        updateDisplay();
    });

    document.addEventListener('keydown', (e) => {
        if ((e.key >= '0' && e.key <= '9') || e.key === '.') {
            const button = document.querySelector(`#${e.key === '.' ? 'decimal' : e.key}`);
            if (button) button.click();
        } else if (['+', '-', '*', '/'].includes(e.key)) {
            const opMap = { '+': 'add', '-': 'subtract', '*': 'multiply', '/': 'divide' };
            const button = document.querySelector(`#${opMap[e.key]}`);
            if (button) button.click();
        } else if (e.key === 'Enter' || e.key === '=') {
            equalsButton.click();
        } else if (e.key === 'Escape') {
            clearButton.click();
        } else if (e.key === 'Backspace') {
            deleteButton.click();
        }
    });

    updateDisplay();
});
