let level = 0;
let progress = 0;

const numberElement = document.getElementById("number");
const nextElement = document.getElementById("next");
const progressBar = document.getElementById("progress_bar");
const progressText = document.getElementById("progress_text");
const advanceButton = document.getElementById("advance");

function fgh(level, n) {
    if (level === 0) {
        return n + 1;
    }

    if (level === 1) {
        return 2 * n;
    }

    if (level === 2) {
        return n * 2 ** n;
    }

    return null;
}

function formatFGH(level) {
    return `f₍${level}₎(10)`;
}

function update() {
    numberElement.textContent = formatFGH(level);
    nextElement.textContent = formatFGH(level + 1);

    progressBar.style.width = `${progress}%`;
    progressText.textContent = `${progress.toFixed(2)}%`;

    if (level >= 2) {
        advanceButton.disabled = true;
        nextElement.textContent = "f₃(10)";
    }
}

advanceButton.addEventListener("click", () => {
    progress += 10;

    if (progress >= 100) {
        progress = 0;
        level++;
    }

    update();
});

update();sc
