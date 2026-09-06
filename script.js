```javascript
let level = 0;
let iteration = 1;
let progress = 0;
let clickPower = 1;

const MAX_FINITE_LEVEL = 9;

const numberElement = document.getElementById("number");
const nextElement = document.getElementById("next");
const progressBar = document.getElementById("progress_bar");
const progressText = document.getElementById("progress_text");
const advanceButton = document.getElementById("advance");

const subscriptDigits = "₀₁₂₃₄₅₆₇₈₉";
const superscriptDigits = "⁰¹²³⁴⁵⁶⁷⁸⁹";

function subscript(number) {
    return String(number)
        .split("")
        .map(digit => subscriptDigits[Number(digit)])
        .join("");
}

function superscript(number) {
    return String(number)
        .split("")
        .map(digit => superscriptDigits[Number(digit)])
        .join("");
}

function formatTerm(level, iteration = 1) {
    if (level === "ω") {
        return "fω(10)";
    }

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
    if (level === "ω") {
        return "∞";
    }

    // The 10th iteration becomes the next FGH level.
    // Therefore there is no separate fₙ¹⁰(10) -> fₙ₊₁(10) click.
    if (iteration < 9) {
        return formatTerm(level, iteration + 1);
    }

    if (level < MAX_FINITE_LEVEL) {
        return formatTerm(level + 1, 1);
    }

    // f₉¹⁰(10) = f₁₀(10) = fω(10) in this game.
    return "fω(10)";
}

function update() {
    numberElement.textContent = getCurrentTerm();
    nextElement.textContent = getNextTerm();

    progressBar.style.width = `${progress}%`;
    progressText.textContent = `${progress.toFixed(2)}%`;

    if (level === "ω") {
        progressBar.style.width = "100%";
        progressText.textContent = "Complete";
        advanceButton.disabled = true;
    }
}

advanceButton.addEventListener("click", () => {
    if (level === "ω") {
        return;
    }

    progress += clickPower;

    while (progress >= 100) {
        progress -= 100;

        if (iteration < 9) {
            iteration++;
        } else if (level < MAX_FINITE_LEVEL) {
            // Advance directly to the next FGH level.
            level++;
            iteration = 1;
        } else {
            // f₉¹⁰(10) = f₁₀(10) = fω(10)
            level = "ω";
            iteration = 1;
            progress = 0;
            break;
        }
    }

    update();
});

update();
```
