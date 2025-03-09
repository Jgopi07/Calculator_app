<script>
       let display = document.getElementById("display");

// Ensure input box is focused on load
window.onload = function () {
    display.value = ""; // Clear input on load
    display.focus();
};

// Function to append numbers without double input issue
function appendNumber(num) {
    let cursorPos = display.selectionStart || display.value.length;
    let textBefore = display.value.substring(0, cursorPos);
    let textAfter = display.value.substring(cursorPos);

    display.value = textBefore + num + textAfter;
    setCursorPosition(cursorPos + 1);
}

function appendOperator(operator) {
    let cursorPos = display.selectionStart || display.value.length;
    let textBefore = display.value.substring(0, cursorPos);
    let textAfter = display.value.substring(cursorPos);

    // Prevent multiple operators in a row
    let lastChar = textBefore[textBefore.length - 1];
    if (lastChar && "+-*/%".includes(lastChar)) return;

    display.value = textBefore + operator + textAfter;
    setCursorPosition(cursorPos + 1);
}

// Backspace functionality
function backspace() {
    let cursorPos = display.selectionStart || display.value.length;
    if (cursorPos === 0) return;
    let textBefore = display.value.substring(0, cursorPos - 1);
    let textAfter = display.value.substring(cursorPos);
    display.value = textBefore + textAfter;
    setCursorPosition(cursorPos - 1);
}

// Clear display function
function clearDisplay() {
    display.value = "";
}

// Handle keyboard input properly
document.addEventListener("keydown", function (event) {
    let key = event.key;

    if (!isNaN(key) || key === ".") {
        event.preventDefault(); // Prevent default behavior
        appendNumber(key); // Append number
    } else if ("+-*/%".includes(key)) {
        event.preventDefault(); // Prevent default behavior
        appendOperator(key); // Append operator
    } else if (key === "Enter") {
        event.preventDefault(); // Prevent default form submission
        calculateResult(); // Calculate result
    } else if (key === "Backspace") {
        event.preventDefault(); // Prevent default behavior
        backspace(); // Delete last character
    } else if (key.toLowerCase() === "c") {
        event.preventDefault(); // Prevent default behavior
        clearDisplay(); // Clear input field
    } else {
        event.preventDefault(); // Block all other key inputs
    }
});

// Keep the input box focused
display.addEventListener("blur", function () {
    setTimeout(() => display.focus(), 10);
});

// Function to calculate result
function calculateResult() {
    let expression = display.value;

    try {
        // Convert percentage calculations correctly (e.g., "8%2" → "8 * (2 / 100)")
        expression = expression.replace(/(\d+(\.\d+)?)%(\d+(\.\d+)?)/g, "($1 * ($3 / 100))");

        let result = eval(expression);
        display.value = result;
    } catch (error) {
        display.value = "Error";
    }
}




    </script>