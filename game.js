let entitySize = 10;

const canvas = document.getElementById("canvas");
const ctx = canvas.getContext("2d");

let simulationSizeX = 800;
let simulationSizeY = 600;

let simulationFrame = 0;
let simulationDuration = 2000;
let totalEntities = 200;
let newEntitiesFromSelection = 19
let entitiesPromotedToNextGeneration = totalEntities / (newEntitiesFromSelection + 1);

let bestFitness = 0;
let bestTime = 0;
let generation = 1;

let obstacles = [];
let entities = [];
let target;

let obstaclesStorageKey = "obstacles";
let entitiesStorageKey = "entities";
let targetStorageKey = "target";

let playing = false;
let aliveEtities = entities.length;
let viewRoot = { x: 0, y: 0 };

let mutationRate = 0.01;
let currentPreset = "default";

let targetColor = "#7CE3FF";
let obstacleColor = "#ff715b";
let obstacleFillColor = "#FFFFFF";
let entityColor = "#052f5f";
let bestEntityColor = "#052f5f";

settings.needsReset = true;
reset();

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
    if (newWidth && newWidth > 0) {
        simulationSizeX = newWidth;
    }
    if (newHeight && newHeight > 0) {
        simulationSizeY = newHeight;
    }
    resetBorderObstacles();
    resetTarget();
    resetEntitiesOrigin();
    if (settings.needsReset) {
        resetSim();
    }
    loadDefaultPreset();
    controls.style = `height: ${controlsHeight}px; width: 100%; min-width: 650px;`;
    settings.needsReset = false;
}

function resetSim() {
    stop();
    bestFitness = 0;
    bestTime = 0;
    generation = 1;
    entities = [];
    for (let i = 0; i < totalEntities; i++) {
        let entity = new Entity(simulationSizeX / 2, simulationSizeY - 20, target, new Dna(simulationDuration), mutationRate, simulationDuration);
        entities.push(entity);
    }

    aliveEtities = entities.length;

    resetObstacles();
}

function updateStatBlock() {
    statBlock.frame = simulationFrame + "/" + simulationDuration;
    statBlock.bestFitness = bestFitness;
    statBlock.bestTime = bestTime;
    statBlock.generation = generation;
    statBlock.speed = `${fpsElement.value} fps`;

    statsFrame.innerText = "Frame: " + statBlock.frame;
    statsBestTime.innerText = "Best time: " + statBlock.bestTime;
    statsBestFitness.innerText = "Best fitness: " + Math.floor(statBlock.bestFitness);
    statsGeneration.innerText = "Generation: " + statBlock.generation;
    statsSpeed.innerText = "Speed: " + statBlock.speed;
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
    drawObstacles();
    drawEntities();
    updateStatBlock();
}

function drawGrid() {
    ctx.fillStyle = "#404e4d";
    ctx.fillRect(viewRoot.x, viewRoot.y, simulationSizeX, simulationSizeY);
}

function drawTarget() {
    if (target) {
        ctx.fillStyle = target.color;
        ctx.fillRect(target.x, target.y, target.width, target.height);
        ctx.fillStyle = "#FFFFFF";
        ctx.fillRect(target.x + 8, target.y + 8, target.width - 16, target.height - 16);
    }
}

function drawObstacles() {
    for (let i = 0; i < obstacles.length; i++) {
        if (obstacles[i].x + obstacles[i].width < 0 || obstacles[i].x > canvas.width
            || obstacles[i].y + obstacles[i].height < 0 || obstacles[i].y > canvas.height) {
            continue;
        }
        ctx.fillStyle = obstacles[i].color;
        ctx.fillRect(obstacles[i].x, obstacles[i].y, obstacles[i].width, obstacles[i].height);
        if (obstacles[i].width > 16 && obstacles[i].height > 16) {
            ctx.fillStyle = "#FF8C42";
            ctx.fillRect(obstacles[i].x + 4, obstacles[i].y + 4, obstacles[i].width - 8, obstacles[i].height - 8);
            ctx.fillStyle = obstacleFillColor;
            ctx.fillRect(obstacles[i].x + 8, obstacles[i].y + 8, obstacles[i].width - 16, obstacles[i].height - 16);
        }
    }
}

function drawTempObstacle(obstacle) {
    if (obstacle.x < 0 || obstacle.x > canvas.width
        || obstacle.y < 0 || obstacle.y > canvas.height) {
        return;
    }
    ctx.fillStyle = obstacle.color;
    ctx.fillRect(obstacle.x, obstacle.y, obstacle.width, obstacle.height);
}

function drawTriangle(posX, posY, radius, rotate) {
    ctx.beginPath();
    var a = ((Math.PI * 2) / 3);

    ctx.lineTo(posX + (radius * 2) * Math.cos(a * 0 + rotate), posY + (radius * 2) * Math.sin(a * 0 + rotate));
    ctx.lineTo(posX + radius * Math.cos(a * 1 + rotate), posY + radius * Math.sin(a * 1 + rotate));
    ctx.lineTo(posX + radius * Math.cos(a * 2 + rotate), posY + radius * Math.sin(a * 2 + rotate));

    ctx.closePath();
    ctx.fill();

    return true;
}

function drawEntities() {
    for (let i = 0; i < entities.length; i++) {
        if (entities[i].x < 0 || entities[i].x > canvas.width
            || entities[i].y < 0 || entities[i].y > canvas.height) {
            continue;
        }

        let radians = Math.atan2(entities[i].velocity.y, entities[i].velocity.x)

        ctx.fillStyle = entities[i].color;
        drawTriangle(entities[i].x, entities[i].y, entities[i].size + 2, radians);
        ctx.fillStyle = entities[i].fillColor;
        drawTriangle(entities[i].x, entities[i].y, entities[i].size, radians);
    }

    for (let i = 0; i < entities.length; i++) {
        if (!entities[i].best) {
            continue;
        }
        if (entities[i].x < 0 || entities[i].x > canvas.width
            || entities[i].y < 0 || entities[i].y > canvas.height) {
            continue;
        }
        let radians = Math.atan2(entities[i].velocity.y, entities[i].velocity.x)

        ctx.fillStyle = entities[i].color;
        drawTriangle(entities[i].x, entities[i].y, entities[i].size + 2, radians);
        ctx.fillStyle = entities[i].fillColor;
        drawTriangle(entities[i].x, entities[i].y, entities[i].size, radians);
    }
}

let lastI = -1;
let lastJ = -1;
let initialPos = { x: null, y: null };
let lastPos = { x: null, y: null };
let mouseIsPressed = false;
let mouseButtonPressed = 0;

canvas.addEventListener('touchstart', function (e) {
    mouseDown(e);
    e.preventDefault();
});

canvas.addEventListener('mousedown', function (e) {
    mouseDown(e);
});

function mouseDown(e) {
    mouseIsPressed = true;
    mouseButtonPressed = e.button;
    initialPos.x = e.clientX;
    initialPos.y = e.clientY;
    lastPos.x = e.clientX;
    lastPos.y = e.clientY;
}

canvas.addEventListener('mouseup', function (e) {
    mouseUp(e);
});

canvas.addEventListener('touchend', function (e) {
    mouseUp(e);
    e.preventDefault();
});

function mouseUp(e) {
    if (mouseIsPressed && addObstacleSelected) {
        let o = calcCurrentObstacle();
        console.log(o)
        obstacles.push(o);
    }
    if (mouseIsPressed && !addObstacleSelected) {
        let obstaclesToRemove = []
        for (let i = 0; i < obstacles.length; i++) {
            if (obstacles[i].checkCollision({ x: e.clientX, y: e.clientY - controlsHeight })) {
                obstaclesToRemove.push(obstacles[i])
            }
        }
        for (let i = 0; i < obstaclesToRemove.length; i++) {
            const obstacle = obstaclesToRemove[i];
            obstacles.splice(obstacles.indexOf(obstacle), 1);
        }
    }
    mouseIsPressed = false;
    lastPos.x = null;
    lastPos.y = null;
    redraw();
}

canvas.addEventListener('touchmove', function (e) {
    mouseMove(e);
});

canvas.addEventListener('mousemove', function (e) {
    mouseMove(e);
});

function mouseMove(e) {
    if (!mouseIsPressed) {
        return;
    }
    if (mouseButtonPressed === 0) {
        lastPos.x = e.clientX;
        lastPos.y = e.clientY;
        let obstacle = calcCurrentObstacle();
        if (addObstacleSelected) {
            redraw();
            drawTempObstacle(obstacle);
        } else {

        }
    }
}

function calcCurrentObstacle() {
    let xStart = initialPos.x;
    let xEnd = lastPos.x;
    let yStart = initialPos.y - controlsHeight;
    let yEnd = lastPos.y - controlsHeight;
    if (xStart > xEnd) {
        let temp = xEnd;
        xEnd = xStart;
        xStart = temp;
    }
    if (yStart > yEnd) {
        let temp = yEnd;
        yEnd = yStart;
        yStart = temp;
    }
    return new Obstacle(xStart, yStart, xEnd - xStart, yEnd - yStart);
}

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
    let selectedEntities = entities.slice(0, entitiesPromotedToNextGeneration);
    selectedEntities[0].fillColor = "#00ff00";
    selectedEntities[0].color = "#FFFFFF";
    selectedEntities[0].size = 12;
    selectedEntities[0].best = true;
    bestFitness = selectedEntities[0].fitness;
    bestTime = selectedEntities[0].lastSimulationFrame;
    let newEntities = [];
    for (let i = 0; i < selectedEntities.length; i++) {
        for (let j = 0; j < newEntitiesFromSelection; j++) {
            newEntities.push(selectedEntities[i].mutate());
        }
    }
    entities = selectedEntities.concat(newEntities);
    for (let i = 0; i < entities.length; i++) {
        entities[i].start();
    }
    simulationFrame = 0;
    aliveEtities = entities.length;
    generation += 1;
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
    switchButtons();
    while (playing) {
        await sleep(stepDelay);
        step();
    }
};

function stop() {
    playing = false;
    switchButtons();
}

function ff() {
    let val = fpsElement.value - 0;
    fpsElement.value = val + 30;
    updateStepDelay();
}

function bw() {
    fpsElement.value = fpsElement.value - 30;
    updateStepDelay();
}

async function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

function clearGameState() {
    obstacles = [];
    resetSim();
    resetBorderObstacles();
    redraw();
}

function resetBorderObstacles() {
    obstacles[0] = new Obstacle(0, simulationSizeY - 4, simulationSizeX, 4, obstacleColor);
    obstacles[1] = new Obstacle(0, 0, simulationSizeX, 4, obstacleColor);
    obstacles[2] = new Obstacle(simulationSizeX - 4, 0, 4, simulationSizeY, obstacleColor);
    obstacles[3] = new Obstacle(0, 0, 4, simulationSizeY, obstacleColor);
}

function resetObstacles() {
    obstacles = [];
    resetBorderObstacles();
    resetTarget();
    resetEntitiesOrigin();
}

function resetTarget() {
    target = new Target(simulationSizeX - 50, simulationSizeY / 2, 40, 40, targetColor);
}

function resetEntitiesOrigin() {
    for (let i = 0; i < entities.length; i++) {
        if (!playing) {
            entities[i].x = 100;
            entities[i].y = simulationSizeY / 2;
        }
        entities[i].initialX = 100;
        entities[i].initialy = simulationSizeY / 2;
        entities[i].target = target;
    }
}

function loadDefaultPreset() {
    loadPreset1();
}

function loadPreset1() {
    currentPreset = "preset1";
    resetSim();
    resetObstacles();
    for (let x = 200; x < simulationSizeX - 200; x += 50) {
        for (let y = 0; y <= simulationSizeY; y += 50) {
            if (Math.random() < 0.6) {
                let variance = (Math.random() * 40) - 20;
                obstacles.push(new Obstacle(x + variance, y + variance, 20, 20, obstacleColor));
            }
        }
    }
    redraw();
}

function loadPreset2() {
    currentPreset = "preset2";
    resetSim();
    resetObstacles();
    let obsHeight = simulationSizeY * 0.6;
    obstacles.push(new Obstacle(500, -8, 50, obsHeight, obstacleColor));
    obstacles.push(new Obstacle(1000, simulationSizeY * 0.4, 50, obsHeight + 8, obstacleColor));
    if (simulationSizeX > 1650) {
        obstacles.push(new Obstacle(1500, -8, 50, obsHeight + 8, obstacleColor));
    }
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