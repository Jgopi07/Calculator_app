let display = document.getElementById("display");
let liveResult = document.getElementById("live-result");
let isResultDisplayed = false; 

window.onload = function () {
    display.value = ""; 
    liveResult.textContent = ""; 
    checkDevice(); 
};

function checkDevice() {
    if (/Mobi|Android|iPhone/i.test(navigator.userAgent)) {
        display.setAttribute("readonly", true); 
    } else {
        display.removeAttribute("readonly"); 
        display.focus(); 
    }
}

function appendNumber(num) {
    if (isResultDisplayed) {
        display.value = num; 
        isResultDisplayed = false;
    } else {
        let cursorPos = display.selectionStart || display.value.length;
        let textBefore = display.value.substring(0, cursorPos);
        let textAfter = display.value.substring(cursorPos);

        display.value = textBefore + num + textAfter;
        setCursorPosition(cursorPos + 1);
    }
    calculateLiveResult(); 
}

function appendOperator(operator) {
    if (isResultDisplayed) {
        isResultDisplayed = false; 
    }
    let cursorPos = display.selectionStart || display.value.length;
    let textBefore = display.value.substring(0, cursorPos);
    let textAfter = display.value.substring(cursorPos);

    let lastChar = textBefore[textBefore.length - 1];
    if (lastChar && "+-*/%".includes(lastChar)) return;

    display.value = textBefore + operator + textAfter;
    setCursorPosition(cursorPos + 1);

    calculateLiveResult(); 
}

function backspace() {
    let cursorPos = display.selectionStart || display.value.length;
    if (cursorPos === 0) return;
    let textBefore = display.value.substring(0, cursorPos - 1);
    let textAfter = display.value.substring(cursorPos);
    display.value = textBefore + textAfter;
    setCursorPosition(cursorPos - 1);

    calculateLiveResult(); 
}

function clearDisplay() {
    display.value = "";
    liveResult.textContent = ""; 
    isResultDisplayed = false;
}

function calculateLiveResult() {
    let expression = display.value.trim();

    if (expression === "" || /[+\-*/%]$/.test(expression)) {
        liveResult.textContent = ""; 
        return;
    }

    try {
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

function calculateResult() {
    let expression = display.value.trim();

    try {
        expression = expression.replace(/(\d+(\.\d+)?)%(\d+(\.\d+)?)/g, "($1 * ($3 / 100))");

        let result = eval(expression);
        display.value = result;
        isResultDisplayed = true;
        liveResult.textContent = ""; 
    } catch (error) {
        display.value = "Error";
        liveResult.textContent = ""; 
    }
}

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

function setCursorPosition(position) {
    display.setSelectionRange(position, position);
    display.focus();
}

display.addEventListener("blur", function () {
    setTimeout(() => {
        if (!/Mobi|Android|iPhone/i.test(navigator.userAgent)) {
            display.focus();
        }
    }, 10);
});
