```javascript
let level = 0;
let iteration = 1;
let progress = 0;
let clickPower = 1;

const MAX_ITERATIONS = 10;

const numberElement = document.getElementById("number");
const nextElement = document.getElementById("next");
const progressBar = document.getElementById("progress_bar");
const progressText = document.getElementById("progress_text");
const advanceButton = document.getElementById("advance");

const digitsSubscript = "₀₁₂₃₄₅₆₇₈₉";
const digitsSuperscript = "⁰¹²³⁴⁵⁶⁷⁸⁹";

function subscript(number) {
    return String(number)
        .split("")
        .map(digit => digitsSubscript[Number(digit)])
        .join("");
}

function superscript(number) {
    return String(number)
        .split("")
        .map(digit => digitsSuperscript[Number(digit)])
        .join("");
}

function formatTerm(level, iteration = 1) {
    const f = `f${subscript(level)}`;

    if (iteration === 1) {
        return `${f}(10)`;
    }

    return `${f}${superscript(iteration)}(10)`;
}

function getCurrentTerm() {
    return formatTerm(level, iteration);
}

function getNextTerm() {
    if (iteration < MAX_ITERATIONS) {
        return formatTerm(level, iteration + 1);
    }

    if (level < 10) {
        return formatTerm(level + 1, 1);
    }

    return "fω(10)";
}

function update() {
    numberElement.textContent = getCurrentTerm();
    nextElement.textContent = getNextTerm();

    progressBar.style.width = `${progress}%`;
    progressText.textContent = `${progress.toFixed(2)}%`;
}

advanceButton.addEventListener("click", () => {
    progress += clickPower;

    while (progress >= 100) {
        progress -= 100;

        if (iteration < MAX_ITERATIONS) {
            iteration++;
        } else if (level < 10) {
            level++;
            iteration = 1;
        } else {
            // Reached fω(10)
            level = "ω";
            iteration = 1;
            progress = 0;
            advanceButton.disabled = true;
            break;
        }
    }

    update();
});

update();
```

This also means if `clickPower = 10`, **one click advances an entire iteration**, instead of requiring 10 clicks.
