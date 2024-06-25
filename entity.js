class Entity {
    /**
     * @param {number} x
     * @param {number} y
     * @param {number} size
     * @param {Target} target
     * @param {Dna} dna
     * @param {number} mutationRate
     * @property {Vector2} velocity
     */
    constructor(x, y, size, target, dna, mutationRate, simulationDuration) {
        this.fitness = 0;
        this.initialX = x;
        this.initialy = y;
        this.x = x;
        this.y = y;
        this.velocity = new Vector2(0, 0);
        this.simulationDuration = simulationDuration;
        this.target = target;
        this.dna = dna;
        this.mutationRate = mutationRate;
        this.size = size;
        this.color = "#3AAFB9";
        this.alive = true;
        this.lastSimulationFrame = 0;
        let v = new Vector2(this.initialX, this.initialy);
        this.initialDistanceToTarget = v.distance(target);
    }

    calculateFitness() {
        this.fitness = -this.lastSimulationFrame;
        let lastPosition = new Vector2(this.x, this.y);
        this.fitness -= lastPosition.distance(target);
        if (target.checkCollision(this)) {
            this.fitness += this.initialDistanceToTarget;
        } else {
            this.fitness -= this.simulationDuration;
        }
    }

    start() {
        this.alive = true;
        this.velocity = new Vector2(0, 0);
        this.x = this.initialX;
        this.y = this.initialy;
    }

    mutate() {
        let newDna = structuredClone(this.dna);
        let geneChanges = Math.floor(Math.random() * newDna.genes.length * this.mutationRate) + 1
        for (let i = 0; i < geneChanges; i++) {
            let geneToChange = Math.floor(Math.random() * newDna.genes.length);
            newDna.genes[geneToChange] = Dna.prototype.randomVec2(newDna.maxSpeed);
        }
        let newEntity = new Entity(this.initialX, this.initialy, this.size, this.target, newDna, this.mutationRate, this.simulationDuration);
        this.fitness = 0;
        return newEntity;
    }

    stop() {
        this.alive = false;
    }

    acelerate(simulationFrame) {
        if (this.alive) {
            this.velocity.add(this.dna.genes[simulationFrame]);
            this.lastSimulationFrame = simulationFrame;
        }
    }

    move() {
        if (this.alive) {
            this.x = this.x + this.velocity.x;
            this.y = this.y + this.velocity.y;
        }
    }
}