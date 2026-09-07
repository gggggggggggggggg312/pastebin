let level = 0;
let iteration = 0;
let progress = 0;

let points = 0;
let clickPower = 1;
let clickPowerCost = 10;

const MAX_FINITE_LEVEL = 9;

// 25% per click = 4 clicks per recursive step at Click Power 1.
const PROGRESS_PER_CLICK = 25;

const numberElement = document.getElementById("number");
const nextElement = document.getElementById("next");
const progressBar = document.getElementById("progress_bar");
const progressText = document.getElementById("progress_text");
const advanceButton = document.getElementById("advance");

const pointsElement = document.getElementById("points");
const clickPowerElement = document.getElementById("click_power");
const clickPowerLevelElement = document.getElementById("click_power_level");
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

function functionName(level) {
    return `f${subscript(level)}`;
}

/*
    Examples:

    level 0:
        f₀(10)

    level 1:
        f₁(f₀(10))
        f₁²(f₀(10))
        f₁³(f₀(10))
        ...

    level 2:
        f₂(f₁⁹(f₀(10)))
        f₂²(f₁⁹(f₀(10)))
        ...
*/

function formatTerm(level, iteration = 0) {
    if (level === "ω") {
        return "fω(10)";
    }

    if (level === 0) {
        return "f₀(10)";
    }

    const inner = formatTerm(level - 1, 9);

    if (iteration === 1) {
        return `${functionName(level)}(${inner})`;
    }

    return `${functionName(level)}${superscript(iteration)}(${inner})`;
}

function getCurrentTerm() {
    return formatTerm(level, iteration);
}

function getNextTerm() {
    if (level === "ω") {
        return "∞";
    }

    if (level === 0) {
        return formatTerm(1, 1);
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
    clickPowerLevelElement.textContent = clickPower;
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

        if (level === 0) {
            // f₀(10) → f₁(f₀(10))
            level = 1;
            iteration = 1;
        } else if (iteration < 9) {
            // f₁ⁿ(...) → f₁ⁿ⁺¹(...)
            iteration++;
        } else if (level < MAX_FINITE_LEVEL) {
            // Move to the next FGH level.
            level++;
            iteration = 1;
        } else {
            // f₉⁹(...) → fω(10)
            level = "ω";
            iteration = 0;
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
