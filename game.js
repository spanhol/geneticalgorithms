let entitySize = 10;

const canvas = document.getElementById("canvas");
const ctx = canvas.getContext("2d");

let simulationSizeX = 800;
let simulationSizeY = 600;

let simulationFrame = 0;
let simulationDuration = 300;
let totalEntities = 100;
let entitiesPromoteToNextGeneration = totalEntities / 2;

let obstacles = [];
let entities = [];
let target;

let obstaclesStorageKey = "obstacles";
let entitiesStorageKey = "entities";
let targetStorageKey = "target";

let playing = false;
let aliveEtities = entities.length;
let viewRoot = { x: 0, y: 0 };

window.addEventListener('resize', function () {
    debounce(redraw());
});

function setTableWidth(newWidth) {
    if (simulationSizeX !== newWidth) {
        init(newWidth, null);
    }
}

function setTableHeight(newHeight) {
    if (simulationSizeY !== newHeight) {
        init(null, newHeight);
    }
}

function init(newWidth, newHeight) {
    settings.needsReset = false;
    if (newWidth && newWidth > 0) {
        simulationSizeX = newWidth;
    }
    if (newHeight && newHeight > 0) {
        simulationSizeY = newHeight;
    }
    target = new Target(simulationSizeX / 2, 50, 40, 40, "#DB5461");

    entities = [];
    for (let i = 0; i < totalEntities; i++) {
        let entity = new Entity(simulationSizeX / 2, simulationSizeY - 20, 20, target, new Dna(simulationDuration), 0.05, simulationDuration);
        entities.push(entity);
    }
    obstacles = [];
    obstacles[0] = new Obstacle(0, simulationSizeY - 2, simulationSizeX, 50, "#FDE74C");
    obstacles[1] = new Obstacle(0, 0, simulationSizeX, 2, "#FDE74C");
    obstacles[2] = new Obstacle(simulationSizeX - 2, 0, 2, simulationSizeY, "#FDE74C");
    obstacles[3] = new Obstacle(0, 0, 2, simulationSizeY, "#FDE74C");
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
    drawObstacles();
}

function drawGrid() {
    ctx.fillStyle = "#06070E";
    ctx.fillRect(viewRoot.x, viewRoot.y, simulationSizeX, simulationSizeY);
}

function drawTarget() {
    if (target) {
        ctx.fillStyle = target.color;
        ctx.fillRect(target.x, target.y, target.width, target.height);
        ctx.fillStyle = "#FFFFFF";
        ctx.fillRect(target.x + 4, target.y + 4, target.width - 8, target.height - 8);
    }
}

function drawObstacles() {
    for (let i = 0; i < obstacles.length; i++) {
        if (obstacles[i].x < 0 || obstacles[i].x > canvas.width
            || obstacles[i].y < 0 || obstacles[i].y > canvas.height) {
            continue;
        }
        ctx.fillStyle = obstacles[i].color;
        ctx.fillRect(obstacles[i].x, obstacles[i].y, obstacles[i].width, obstacles[i].height);
    }
}

function drawEntities() {
    for (let i = 0; i < entities.length; i++) {
        if (entities[i].x < 0 || entities[i].x > canvas.width
            || entities[i].y < 0 || entities[i].y > canvas.height) {
            continue;
        }
        ctx.fillStyle = entities[i].color;
        let path = new Path2D();
        path.moveTo((entities[i].x) + entities[i].size / 3, entities[i].y);
        path.lineTo((entities[i].x), entities[i].y - entities[i].size);
        path.lineTo((entities[i].x) - entities[i].size / 3, entities[i].y);
        ctx.fill(path);
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
    if (e.button === 0) {

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
    if (mouseButtonPressed === 0) {
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
    for (let i = 0; i < entities.length; i++) {
        if (!entities[i].alive) {
            continue;
        }
        entities[i].acelerate(simulationFrame);
        entities[i].move();
        let collisionOccured = checkCollisions(entities[i]);
        if (collisionOccured) {
            entities[i].stop();
            aliveEtities--;
        }
    }

    simulationFrame++;
    debounce(redraw());
    if (simulationFrame >= simulationDuration || aliveEtities < 1) {
        nextGeneration();
    }
};

function nextGeneration() {
    for (let i = 0; i < entities.length; i++) {
        entities[i].calculateFitness();
    }
    entities.sort(({ fitness: a }, { fitness: b }) => b - a);
    let selectedEntities = entities.slice(0, entitiesPromoteToNextGeneration);
    selectedEntities[0].color = "#0FFF95";
    let newEntities = [];
    for (let i = 0; i < selectedEntities.length; i++) {
        newEntities.push(selectedEntities[i].mutate());
    }
    entities = selectedEntities.concat(newEntities);
    for (let i = 0; i < entities.length; i++) {
        entities[i].start();
    }
    simulationFrame = 0;
    aliveEtities = entities.length;
}

function checkCollisions(entity) {
    for (let i = 0; i < obstacles.length; i++) {
        if (obstacles[i].checkCollision(entity)) {
            return true;
        }
    }
    return target.checkCollision(entity);
}

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
    aliveEtities = entities.length;
    switchButtons();
    while (playing) {
        await sleep(stepDelay);
        step();
    }
};

function stop() {
    playing = false;
    simulationFrame = 0;
    switchButtons();
}

async function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

function load() {
    obstacles = JSON.parse(localStorage.getItem(obstaclesStorageKey));
    console.log(obstacles);
    entities = JSON.parse(localStorage.getItem(entitiesStorageKey));
    console.log(entities);
    target = JSON.parse(localStorage.getItem(targetStorageKey));
    console.log(target);
    redraw();
}

function save() {
    localStorage.setItem(entitiesStorageKey, JSON.stringify(entities));
    localStorage.setItem(obstaclesStorageKey, JSON.stringify(obstacles));
    localStorage.setItem(targetStorageKey, JSON.stringify(target));
}

function clearSimulation() {
    entities = [];
    obstacles = [];
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