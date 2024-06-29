class Entity {
    /**
     * @param {number} initialX
     * @param {number} initialy
     * @param {number} size
     * @param {Target} target
     * @param {Dna} dna
     * @param {number} mutationRate
     * @property {Vector2} velocity
     */
    constructor(initialX, initialy, size, target, dna, mutationRate, simulationDuration) {
        this.fitness = 0;
        this.lastSimulationFrame = 0;
        this.color = "#3AAFB9";
        this.alive = true;
        this.x = initialX;
        this.y = initialy;
        this.initialX = initialX;
        this.initialy = initialy;
        this.velocity = new Vector2(0, 0);
        this.simulationDuration = simulationDuration;
        this.target = target;
        this.dna = dna;
        this.mutationRate = mutationRate;
        this.size = size;
        let v = new Vector2(this.initialX, this.initialy);
        this.initialDistanceToTarget = v.distance(target);
    }

    calculateFitness() {
        this.fitness = 0;
        if (this.alive) {
            this.lastSimulationFrame = this.simulationDuration;
        }
        let lastPosition = new Vector2(this.x, this.y);
        let distance = this.initialDistanceToTarget - lastPosition.distance(target);
        this.fitness += distance;
        // console.log("alive: " + this.alive + " distance: " + distance)
        if (target.checkCollision(this)) {
            this.fitness += this.initialDistanceToTarget * 10;
            this.fitness -= this.lastSimulationFrame * 10;
            // console.log("On Target: " + ((this.initialDistanceToTarget * 10) - (this.lastSimulationFrame * 10)));
            // console.log(this.initialDistanceToTarget);
            // console.log(this.lastSimulationFrame);
        } else {
            this.fitness += this.lastSimulationFrame * 5;
            this.fitness -= this.simulationDuration;
            // console.log("OFF Target: " + (this.lastSimulationFrame - this.simulationDuration));
        }

        // console.log("FIT: " + this.fitness);
        // console.log("\n");
    }

    start() {
        this.alive = true;
        this.velocity = new Vector2(0, 0);
        this.x = this.initialX;
        this.y = this.initialy;
    }

    mutate() {
        let newDna = structuredClone(this.dna);
        let geneChanges = Math.floor(Math.random() * newDna.genes.length * this.mutationRate) + 1;
        geneChanges = 1;
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