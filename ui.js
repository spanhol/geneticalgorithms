const controls = document.getElementById("controls");
const playButton = document.getElementById("play");
const stopButton = document.getElementById("stop");
const drawButton = document.getElementById("drawtool");
const panButton = document.getElementById("pantool");
const fpsElement = document.getElementById("speed");

const gridX = document.getElementById("gridx");
const gridY = document.getElementById("gridy");
let simulationSizeX = 800;
let simulationSizeY = 600;

let drawing = true;
let panning = false;

const dialog = document.getElementById("settingsDialog");
const applySettingsButton = document.getElementById("applySettings");
const settings = { needsReset: true }

function openSettings() {
    dialog.showModal();
};

function applySettings() {
    dialog.close();
    reset(settings)
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
}

fpsElement.addEventListener("change", function () {
    updateStepDelay();
}, false);

function zoomPlus() {
    zoomLevel -= 1;
    redraw();
}

function zoomLess() {
    zoomLevel += 1;
    redraw();
}

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

gridX.value = 600;
gridY.value = 800;

gridX.addEventListener("change", function () {
    setTableWidth(gridX.value)
}, false);

gridY.addEventListener("change", function () {
    setTableHeight(gridY.value)
}, false);

function selectDrawTool() {
    drawing = true;
    panning = false;
    drawButton.classList.remove("btn-secondary");
    panButton.classList.remove("btn-primary");
    drawButton.classList.add("btn-primary");
    panButton.classList.add("btn-secondary");
}

function selectPanTool() {
    drawing = false;
    panning = true;
    drawButton.classList.remove("btn-primary");
    panButton.classList.remove("btn-secondary");
    drawButton.classList.add("btn-secondary");
    panButton.classList.add("btn-primary");
}
