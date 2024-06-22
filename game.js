let entitySize = 10;
let entityColor = "#99ffff";
let barrierColor = "#99ffff";

const canvas = document.getElementById("canvas");
const ctx = canvas.getContext("2d");

let simulationSizeX = 800;
let simulationSizeY = 600;

let barriers = [];
let entities = [];
let target;

let barriersStorageKey = "barriers";
let entitiesStorageKey = "entities";
let targetStorageKey = "target";

let playing = false;
let viewRoot = { x: 0, y: 0 };

window.addEventListener('resize', function () {
    debounce(redraw());
});

function setTableWidth(newWidth) {
    init(newWidth, null);
}

function setTableHeight(newHeight) {
    init(null, newHeight);
}

function init(newWidth, newHeight) {
    settings.needsReset = false;
    if (newWidth && newWidth > 0) {
        simulationSizeX = newWidth;
    }
    if (newHeight && newHeight > 0) {
        simulationSizeY = newHeight;
    }
    target = new Target(simulationSizeX / 2, 50, 40, "#ff0000");
    controls.style = `height: ${controlsHeight}px; width: 100%;`;
}

function reset() {
    settings.needsReset = true;
    init()
    redraw()
}

function redraw() {
    resize();
    drawGrid();
    drawTarget();
    drawEntities();
}

function drawGrid() {
    ctx.fillStyle = "#000";
    ctx.fillRect(viewRoot.x, viewRoot.y, simulationSizeX, simulationSizeY);
}

function drawTarget() {
    if (target) {
        ctx.fillStyle = target.targetColor;
        ctx.fillRect(target.x, target.y, target.targetSize, target.targetSize);
    }

}

function drawBarriers() {

}

function drawEntities() {
    for (let i = 0; i < entities.length; i++) {
        let x = entities[i].x * entitySize + viewRoot.x;
        if (x > canvas.length) {
            break;
        }
        if (x < 0) {
            continue;
        }
        for (let j = 0; j < entities.length; j++) {
            let y = j * entitySize + viewRoot.y;
            if (y > canvas.width) {
                break;
            }
            if (y < 0) {
                continue;
            }
            if (entities[i]) {
                ctx.fillStyle = entities[i].entityColor;
                ctx.fillRect(x, y, entitySize, entitySize);
            }
        }
    }
}


let lastI = -1;
let lastJ = -1;
let lastPos = { x: null, y: null };
let mouseIsPressed = false;
let mouseButtonPressed = 0;
let setTo = 1;

canvas.addEventListener('mousedown', function (e) {
    mouseIsPressed = true;
    mouseButtonPressed = e.button;
    lastPos.x = e.clientX;
    lastPos.y = e.clientY;
    if (e.button == 0) {

    }
});

canvas.addEventListener('mouseup', function (e) {
    mouseIsPressed = false;
    lastPos.x = null;
    lastPos.y = null;
});

canvas.addEventListener('mousemove', function (e) {
    if (!mouseIsPressed) {
        return;
    }
    if (mouseButtonPressed == 0) {
        mouseDrawing(e)
    }
});

function mouseDrawing(e) {
    let xStart = lastPos.x;
    let xEnd = e.clientX;
    let yStart = lastPos.y;
    let yEnd = e.clientY;
    if (!playing) {
        redraw();
    }
    lastPos.x = e.clientX;
    lastPos.y = e.clientY;
}

reset();

function step() {
    //TODO
    debounce(redraw());
};

function switchButtons() {
    if (playing) {
        playButton.style.display = "none";
        stopButton.style.display = "inline";
    } else {
        playButton.style.display = "inline";
        stopButton.style.display = "none";
    }
}

async function play() {
    playing = true;
    switchButtons();
    while (playing) {
        await sleep(stepDelay);
        step()
    }
};

function stop() {
    playing = false;
    switchButtons();
}

async function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

function load() {
    barriers = JSON.parse(localStorage.getItem(barriersStorageKey));
    console.log(barriers);
    entities = JSON.parse(localStorage.getItem(entitiesStorageKey));
    console.log(entities);
    target = JSON.parse(localStorage.getItem(targetStorageKey));
    console.log(target);
    redraw();
}

function save() {
    localStorage.setItem(entitiesStorageKey, JSON.stringify(entities));
    localStorage.setItem(barriersStorageKey, JSON.stringify(barriers));
    localStorage.setItem(targetStorageKey, JSON.stringify(target));
}

function clearSimulation() {
    entities = [];
    barriers = [];
    target = null;
    init(simulationSizeX, simulationSizeY);
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