const controls = document.getElementById("controls");
const playButton = document.getElementById("play");
const ffButton = document.getElementById("ff");
const bwButton = document.getElementById("bw");
const stopButton = document.getElementById("stop");

const addButton = document.getElementById("add");
const minusButton = document.getElementById("minus");
let addObstacleSelected = true;
const fpsElement = document.getElementById("speed");

const gridX = document.getElementById("gridx");
const gridY = document.getElementById("gridy");

const dialog = document.getElementById("settingsDialog");
const applySettingsButton = document.getElementById("applySettings");
const settings = { needsReset: true }


const controlsHeight = 60;
fpsElement.value = 30;
let stepDelay = 30;


const statBlock = {
    frame: "",
    simulationDuration: 0,
    generation: 1,
    bestTime: 0,
    bestFitness: 0,
    speed: `${stepDelay}/s`
};

const stats = document.getElementById("stats");
stats.style = `font-size:12px;color:white; position: absolute; bottom: 20px; left: 20px;`;

const statsFrame = document.createElement("span");
stats.appendChild(statsFrame);
stats.appendChild(document.createElement("br"));

const statsBestTime = document.createElement("span");
stats.appendChild(statsBestTime);
stats.appendChild(document.createElement("br"));

const statsBestFitness = document.createElement("span");
stats.appendChild(statsBestFitness);
stats.appendChild(document.createElement("br"));

const statsGeneration = document.createElement("span");
stats.appendChild(statsGeneration);
stats.appendChild(document.createElement("br"));

const statsSpeed = document.createElement("span");
stats.appendChild(statsSpeed);
stats.appendChild(document.createElement("br"));

function selectAdd() {
    addObstacleSelected = true;
    addButton.classList.remove("btn-secondary");
    minusButton.classList.remove("btn-primary");
    addButton.classList.add("btn-primary");
    minusButton.classList.add("btn-secondary");
}

function selectMinus() {
    addObstacleSelected = false;
    addButton.classList.remove("btn-primary");
    minusButton.classList.remove("btn-secondary");
    addButton.classList.add("btn-secondary");
    minusButton.classList.add("btn-primary");
}

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

updateStepDelay();
function updateStepDelay() {
    let val = fpsElement.value;
    if (!val || val < 1) {
        val = 30;
        fpsElement.value = 30;
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
