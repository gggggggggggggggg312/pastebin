let level = 0;
let iteration = 1;
let progress = 0;

const numberElement = document.getElementById("number");
const nextElement = document.getElementById("next");
const progressBar = document.getElementById("progress_bar");
const progressText = document.getElementById("progress_text");
const advanceButton = document.getElementById("advance");

const MAX_ITERATIONS = 10;

function subscript(number) {
    const digits = "₀₁₂₃₄₅₆₇₈₉";
    return String(number)
        .split("")
        .map(digit => digits[Number(digit)])
        .join("");
}

function superscript(number) {
    const digits = "⁰¹²³⁴⁵⁶⁷⁸⁹";
    return String(number)
        .split("")
        .map(digit => digits[Number(digit)])
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

    return formatTerm(level + 1, 1);
}

function update() {
    numberElement.textContent = getCurrentTerm();
    nextElement.textContent = getNextTerm();

    progressBar.style.width = `${progress}%`;
    progressText.textContent = `${progress.toFixed(2)}%`;
}

advanceButton.addEventListener("click", () => {
    progress += 10;

    if (progress >= 100) {
        progress = 0;

        if (iteration < MAX_ITERATIONS) {
            iteration++;
        } else {
            iteration = 1;
            level++;
        }
    }

    update();
});

update();
