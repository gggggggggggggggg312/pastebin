let level = 0;
let iteration = 1;
let progress = 0;

let points = 0;
let clickPower = 1;
let clickPowerCost = 10;

const MAX_FINITE_LEVEL = 9;
const PROGRESS_PER_CLICK = 25;

const numberElement = document.getElementById("number");
const nextElement = document.getElementById("next");
const progressBar = document.getElementById("progress_bar");
const progressText = document.getElementById("progress_text");
const advanceButton = document.getElementById("advance");

const pointsElement = document.getElementById("points");
const clickPowerElement = document.getElementById("click_power");
const clickPowerCostElement = document.getElementById("click_power_cost");
const buyClickPowerButton = document.getElementById("buy_click_power");

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

/*
    Normal FGH notation:

    f₀(10)
    f₀²(10)
    ...
    f₀⁹(10)
    f₁(10)
    f₁²(10)
    ...
    f₉⁹(10)
    fω(10)
*/

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

    if (iteration < 9) {
        return formatTerm(level, iteration + 1);
    }

    if (level < MAX_FINITE_LEVEL) {
        return formatTerm(level + 1, 1);
    }

    return "fω(10)";
}

function update() {
    numberElement.textContent = getCurrentTerm();
    nextElement.textContent = getNextTerm();

    progressBar.style.width = `${progress}%`;
    progressText.textContent = `${progress.toFixed(0)}%`;

    pointsElement.textContent = points;
    clickPowerElement.textContent = clickPower;
    clickPowerCostElement.textContent = clickPowerCost;

    if (level === "ω") {
        progressBar.style.width = "100%";
        progressText.textContent = "Complete";

        advanceButton.disabled = true;
        buyClickPowerButton.disabled = true;
        return;
    }

    advanceButton.disabled = false;
    buyClickPowerButton.disabled = points < clickPowerCost;
}

advanceButton.addEventListener("click", () => {
    if (level === "ω") {
        return;
    }

    points += clickPower;
    progress += PROGRESS_PER_CLICK * clickPower;

    while (progress >= 100) {
        progress -= 100;

        if (iteration < 9) {
            iteration++;
        } else if (level < MAX_FINITE_LEVEL) {
            level++;
            iteration = 1;
        } else {
            level = "ω";
            iteration = 1;
            progress = 0;
            break;
        }
    }

    update();
});

buyClickPowerButton.addEventListener("click", () => {
    if (points < clickPowerCost) {
        return;
    }

    points -= clickPowerCost;
    clickPower++;
    clickPowerCost *= 2;

    update();
});

update();
