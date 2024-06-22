class Dna {
    /**
     * @param {number} size
     * @param {number} mutationRate
     */
    constructor(size, mutationRate) {
        this.size = size;
        this.mutationRate = mutationRate;
        this.aceleration = 0;
        this.velocity = 0;
        this.fitness = 0;
        this.genes = [];
        for (let i = 0; i < size; i++) {
            this.genes.push(this.randomVec2());
        }
    }

    randomVec2() {
        return new Vector2((Math.random() * 4) - 2, (Math.random() * 4) - 2);
    }
}