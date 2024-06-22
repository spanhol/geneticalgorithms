const controls = document.getElementById("controls");
const playButton = document.getElementById("play");
const stopButton = document.getElementById("stop");
const fpsElement = document.getElementById("speed");

const gridX = document.getElementById("gridx");
const gridY = document.getElementById("gridy");

const dialog = document.getElementById("settingsDialog");
const applySettingsButton = document.getElementById("applySettings");
const settings = { needsReset: true }

function openSettings() {
    dialog.showModal();
};

function applySettings() {
    dialog.close();
    reset()
};

dialog.addEventListener("click", event => {
    const rect = dialog.getBoundingClientRect();
    if (event.clientY < rect.top || event.clientY > rect.bottom ||
        event.clientX < rect.left || event.clientX > rect.right) {
        dialog.close();
    }
});

const controlsHeight = 60;
fpsElement.value = 20;
let stepDelay = 50;

updateStepDelay();
function updateStepDelay() {
    let val = fpsElement.value;
    if (!val || val < 1) {
        val = 10;
    }
    stepDelay = 1000 / val;
}

function resize() {
    let canvas = document.getElementById("canvas");
    canvas.width = window.innerWidth - 10;
    canvas.height = window.innerHeight - 10 - controlsHeight;
    gridX.value = canvas.width;
    gridY.value = canvas.height;
    setTableWidth(gridX.value);
    setTableHeight(gridY.value);
}

fpsElement.addEventListener("change", function () {
    updateStepDelay();
}, false);

function clearSimulationState() {
    clearSimulation();
    redraw();
}

async function debounce(func, timeout = 300) {
    let timer = undefined;
    return (...args) => {
        if (!timer) {
            func.apply(this, args);
        }
        clearTimeout(timer);
        timer = setTimeout(() => {
            timer = undefined;
        }, timeout);
    };
}

gridX.value = 800;
gridY.value = 600;

gridX.addEventListener("change", function () {
    setTableWidth(gridX.value)
}, false);

gridY.addEventListener("change", function () {
    setTableHeight(gridY.value)
}, false);
