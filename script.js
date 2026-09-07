let level = 0;
let iteration = 1;
let progress = 0;

let points = 0;

// ================================
// UPGRADES
// ================================

let clickPower = 1;
let clickPowerCost = 10;

let progressPower = 1;
let progressPowerCost = 25;

let autoAdvance = 0;
let autoAdvanceCost = 100;

// ================================
// SETTINGS
// ================================

const MAX_FINITE_LEVEL = 9;

// Base progress from one click.
const BASE_PROGRESS = 5;

// ================================
// HTML ELEMENTS
// ================================

const numberElement = document.getElementById("number");
const nextElement = document.getElementById("next");

const progressBar = document.getElementById("progress_bar");
const progressText = document.getElementById("progress_text");

const pointsElement = document.getElementById("points");

const advanceButton = document.getElementById("advance");

const clickPowerElement = document.getElementById("click_power");
const clickProgressElement = document.getElementById("click_progress");
const clickPowerCostElement = document.getElementById("click_power_cost");
const buyClickPowerButton = document.getElementById("buy_click_power");

const progressPowerElement = document.getElementById("progress_power");
const progressPowerCostElement = document.getElementById("progress_power_cost");
const buyProgressPowerButton = document.getElementById("buy_progress_power");

const autoAdvanceElement = document.getElementById("auto_advance");
const autoAdvanceCostElement = document.getElementById("auto_advance_cost");
const buyAutoAdvanceButton = document.getElementById("buy_auto_advance");

// ================================
// NOTATION
// ================================

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

// ================================
// FGH TERM FORMATTER
// ================================

function formatTerm(level, iteration = 1) {

    // fω(10), fω²(10), fω³(10), ...
    if (level === "ω") {

        if (iteration === 1) {
            return "fω(10)";
        }

        return `fω${superscript(iteration)}(10)`;
    }

    const functionName = `f${subscript(level)}`;

    // f₀(10), f₁(10), f₂(10), ...
    if (iteration === 1) {
        return `${functionName}(10)`;
    }

    // f₀²(10), f₁²(10), ...
    return `${functionName}${superscript(iteration)}(10)`;
}

// ================================
// CURRENT / NEXT TERM
// ================================

function getCurrentTerm() {
    return formatTerm(level, iteration);
}

function getNextTerm() {

    // Once we reach fω, keep iterating fω.
    if (level === "ω") {
        return formatTerm("ω", iteration + 1);
    }

    // fₙ(10) → fₙ²(10) → ... → fₙ⁹(10)
    if (iteration < 9) {
        return formatTerm(level, iteration + 1);
    }

    // fₙ⁹(10) → fₙ₊₁(10)
    if (level < MAX_FINITE_LEVEL) {
        return formatTerm(level + 1, 1);
    }

    // f₉⁹(10) → fω(10)
    return "fω(10)";
}

// ================================
// ADVANCEMENT
// ================================

function advanceProgress(amount) {

    progress += amount;

    while (progress >= 100) {

        progress -= 100;

        // fω → fω² → fω³ → ...
        if (level === "ω") {
            iteration++;
            continue;
        }

        // fₙⁿ → next iteration
        if (iteration < 9) {
            iteration++;
            continue;
        }

        // fₙ⁹ → fₙ₊₁
        if (level < MAX_FINITE_LEVEL) {
            level++;
            iteration = 1;
            continue;
        }

        // f₉⁹ → fω
        level = "ω";
        iteration = 1;
        progress = 0;

        break;
    }
}

// ================================
// UPDATE UI
// ================================

function update() {

    numberElement.textContent = getCurrentTerm();
    nextElement.textContent = getNextTerm();

    progressBar.style.width = `${progress}%`;
    progressText.textContent = `${progress.toFixed(0)}%`;

    pointsElement.textContent = Math.floor(points);

    clickPowerElement.textContent = clickPower;

    const progressPerClick =
        BASE_PROGRESS * clickPower * progressPower;

    clickProgressElement.textContent = progressPerClick;

    clickPowerCostElement.textContent = clickPowerCost;

    progressPowerElement.textContent = progressPower;
    progressPowerCostElement.textContent = progressPowerCost;

    autoAdvanceElement.textContent = autoAdvance;
    autoAdvanceCostElement.textContent = autoAdvanceCost;

    buyClickPowerButton.disabled =
        points < clickPowerCost;

    buyProgressPowerButton.disabled =
        points < progressPowerCost;

    buyAutoAdvanceButton.disabled =
        points < autoAdvanceCost;
}

// ================================
// ADVANCE BUTTON
// ================================

advanceButton.addEventListener("click", () => {

    // Click Power increases points earned.
    points += clickPower;

    // Click Power AND Progress Power increase progression.
    const progressGain =
        BASE_PROGRESS *
        clickPower *
        progressPower;

    advanceProgress(progressGain);

    update();
});

// ================================
// CLICK POWER UPGRADE
// ================================

buyClickPowerButton.addEventListener("click", () => {

    if (points < clickPowerCost) {
        return;
    }

    points -= clickPowerCost;

    clickPower++;

    clickPowerCost =
        Math.ceil(clickPowerCost * 1.75);

    update();
});

// ================================
// PROGRESS POWER UPGRADE
// ================================

buyProgressPowerButton.addEventListener("click", () => {

    if (points < progressPowerCost) {
        return;
    }

    points -= progressPowerCost;

    progressPower++;

    progressPowerCost =
        Math.ceil(progressPowerCost * 2);

    update();
});

// ================================
// AUTO ADVANCE UPGRADE
// ================================

buyAutoAdvanceButton.addEventListener("click", () => {

    if (points < autoAdvanceCost) {
        return;
    }

    points -= autoAdvanceCost;

    autoAdvance++;

    autoAdvanceCost =
        Math.ceil(autoAdvanceCost * 2.5);

    update();
});

// ================================
// AUTO ADVANCE LOOP
// ================================

setInterval(() => {

    if (autoAdvance <= 0) {
        return;
    }

    // Auto advance also generates points.
    points += autoAdvance;

    const progressGain =
        BASE_PROGRESS *
        autoAdvance *
        progressPower;

    advanceProgress(progressGain);

    update();

}, 1000);

// ================================
// INITIAL UPDATE
// ================================

update();
