let zoomLevel = 2;
let entityColor = "#99ffff";
let targetColor = "#444444";
let barrierColor = "#99ffff";

const canvas = document.getElementById("canvas");
const ctx = canvas.getContext("2d");

let barriers = [];
let entities = [];
let target = { x: 50, y: 50 };

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
    controls.style = `height: ${controlsHeight}px; width: 100%;`;
}

function reset() {
    settings.needsReset = true;
    init()
    redraw()
}

function redraw() {
    resize();
    drawTarget();
    // drawEntities();
}

function drawTarget() {
    if (target) {
        ctx.fillStyle = targetColor;
        ctx.fillRect(target.x, target.y, zoomLevel, zoomLevel);
    }

}

function drawBarriers() {

}

function drawEntities() {
    ctx.fillStyle = "#000";
    ctx.fillRect(viewRoot.x, viewRoot.y, simulationSizeX * zoomLevel, simulationSizeY * zoomLevel);
    for (let i = 0; i < entities.length; i++) {
        let x = entities[i].x * zoomLevel + viewRoot.x;
        if (x > canvas.length) {
            break;
        }
        if (x < 0) {
            continue;
        }
        for (let j = 0; j < entities.length; j++) {
            let y = j * zoomLevel + viewRoot.y;
            if (y > canvas.width) {
                break;
            }
            if (y < 0) {
                continue;
            }
            if (entities[i]) {
                ctx.fillStyle = entities[i].entityColor;
                ctx.fillRect(x, y, zoomLevel, zoomLevel);
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

function convertPositionToIndex(x, y) {
    y = y - controlsHeight - viewRoot.y;
    x = x - viewRoot.x;
    let i = parseInt(x / zoomLevel);
    let j = parseInt(y / zoomLevel);
    return {
        i: i,
        j: j
    }
}

function getNodeAtPosition(x, y) {
    //TODO
    // let pos = convertPositionToIndex(x, y)
    // if (pos.i < 0 || pos.i >= simulationSizeX || pos.j < 0 || pos.j >= simulationSizeY) {
    //     return;
    // }
    // return {
    //     x: x,
    //     y: y,
    //     i: pos.i,
    //     j: pos.j,
    //     value: entities[pos.i]
    // }
}

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
        if (drawing) {
            mouseDrawing(e)
        } else if (panning) {
            mousePanning(e);
        }
    }
    if (mouseButtonPressed == 1) {
        mousePanning(e);
    }
});

function mouseDrawing(e) {
    let xStart = lastPos.x;
    let xEnd = e.clientX;
    let yStart = lastPos.y;
    let yEnd = e.clientY;
    let nodes = getNodesAtPositions(xStart, xEnd, yStart, yEnd);
    for (let index = 0; index < nodes.length; index++) {
        const node = nodes[index];
        setValue(node, setTo);
    }
    if (!playing) {
        redraw();
    }
    lastPos.x = e.clientX;
    lastPos.y = e.clientY;
}

function mousePanning(e) {
    let difX = e.clientX - lastPos.x;
    let difY = e.clientY - lastPos.y;
    if (difX != 0 || difY != 0) {
        viewRoot.x = viewRoot.x + difX;
        viewRoot.y = viewRoot.y + difY;
        let minPosX = (-simulationSizeX * zoomLevel) + zoomLevel;
        let minPosY = (-simulationSizeY * zoomLevel) + zoomLevel;
        let maxPosX = canvas.width - zoomLevel;
        let maxPosY = canvas.height - zoomLevel;
        if (viewRoot.x < minPosX) {
            viewRoot.x = minPosX;
        }
        if (viewRoot.y < minPosY) {
            viewRoot.y = minPosY;
        }
        if (viewRoot.x > maxPosX) {
            viewRoot.x = maxPosX;
        }
        if (viewRoot.y > maxPosY) {
            viewRoot.y = maxPosY;
        }
        lastPos.x = e.clientX;
        lastPos.y = e.clientY;
        redraw();
    }
}

reset();

function doOneStep() {
    playing = false;
    switchButtons();
    step();
}

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
    target = new Target(50, 50);
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

canvas.addEventListener("wheel", (e) => {
    e.preventDefault();
    if (e.deltaY > 0) {
        zoomPlus()
    } else {
        zoomLess()
    }
});