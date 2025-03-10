let display = document.getElementById("display");
let liveResult = document.getElementById("live-result");
let isResultDisplayed = false; // Track if the last value was a result

// Ensure input box is focused on computers
window.onload = function () {
    display.value = ""; // Clear input on load
    liveResult.textContent = ""; // Clear live result on load
    checkDevice(); // Set input behavior based on device type
};

// Function to check if the device is mobile or not
function checkDevice() {
    if (/Mobi|Android|iPhone/i.test(navigator.userAgent)) {
        display.setAttribute("readonly", true); // Disable input cursor on mobile
    } else {
        display.removeAttribute("readonly"); // Enable cursor on desktop
        display.focus(); // Auto-focus input on desktop
    }
}

// Function to append numbers
function appendNumber(num) {
    if (isResultDisplayed) {
        display.value = num; // Clear answer when number is clicked
        isResultDisplayed = false;
    } else {
        let cursorPos = display.selectionStart || display.value.length;
        let textBefore = display.value.substring(0, cursorPos);
        let textAfter = display.value.substring(cursorPos);

        display.value = textBefore + num + textAfter;
        setCursorPosition(cursorPos + 1);
    }
    calculateLiveResult(); // Update live result immediately
}

// Function to append operators
function appendOperator(operator) {
    if (isResultDisplayed) {
        isResultDisplayed = false; // Allow direct operator continuation
    }
    let cursorPos = display.selectionStart || display.value.length;
    let textBefore = display.value.substring(0, cursorPos);
    let textAfter = display.value.substring(cursorPos);

    // Prevent multiple operators in a row
    let lastChar = textBefore[textBefore.length - 1];
    if (lastChar && "+-*/%".includes(lastChar)) return;

    display.value = textBefore + operator + textAfter;
    setCursorPosition(cursorPos + 1);

    calculateLiveResult(); // Update live result immediately
}

// Backspace functionality
function backspace() {
    let cursorPos = display.selectionStart || display.value.length;
    if (cursorPos === 0) return;
    let textBefore = display.value.substring(0, cursorPos - 1);
    let textAfter = display.value.substring(cursorPos);
    display.value = textBefore + textAfter;
    setCursorPosition(cursorPos - 1);

    calculateLiveResult(); // Update live result after backspace
}

// Clear display function
function clearDisplay() {
    display.value = "";
    liveResult.textContent = ""; // Clear live result
    isResultDisplayed = false;
}

// Function to calculate and show live result
function calculateLiveResult() {
    let expression = display.value.trim();

    if (expression === "" || /[+\-*/%]$/.test(expression)) {
        liveResult.textContent = ""; // Hide result when no valid expression
        return;
    }

    try {
        // Convert percentage calculations (e.g., "10%2" -> "10 * (2 / 100)")
        expression = expression.replace(/(\d+(\.\d+)?)%(\d+(\.\d+)?)/g, "($1 * ($3 / 100))");

        let result = eval(expression);
        if (!isNaN(result)) {
            liveResult.textContent = "= " + result;
        } else {
            liveResult.textContent = "";
        }
    } catch (error) {
        liveResult.textContent = ""; // Hide result on error
    }
}

// Function to calculate final result on "=" button click
function calculateResult() {
    let expression = display.value.trim();

    try {
        // Convert percentage calculations before evaluating
        expression = expression.replace(/(\d+(\.\d+)?)%(\d+(\.\d+)?)/g, "($1 * ($3 / 100))");

        let result = eval(expression);
        display.value = result;
        isResultDisplayed = true;
        liveResult.textContent = ""; // Hide live result when final result is shown
    } catch (error) {
        display.value = "Error";
        liveResult.textContent = ""; // Hide live result on error
    }
}

// Handle keyboard input
document.addEventListener("keydown", function (event) {
    let key = event.key;

    if (!isNaN(key) || key === ".") {
        event.preventDefault();
        appendNumber(key);
    } else if ("+-*/%".includes(key)) {
        event.preventDefault();
        appendOperator(key);
    } else if (key === "Enter") {
        event.preventDefault();
        calculateResult();
    } else if (key === "Backspace") {
        event.preventDefault();
        backspace();
    } else if (key.toLowerCase() === "c") {
        event.preventDefault();
        clearDisplay();
    } else if (key === "ArrowLeft" || key === "ArrowRight") {
        return;
    } else {
        event.preventDefault();
    }
});

// Function to set cursor position
function setCursorPosition(position) {
    display.setSelectionRange(position, position);
    display.focus();
}

// Keep the input box focused on computers
display.addEventListener("blur", function () {
    setTimeout(() => {
        if (!/Mobi|Android|iPhone/i.test(navigator.userAgent)) {
            display.focus();
        }
    }, 10);
});
