class Dna {
    /**
     * @param {number} size
     */
    constructor(size) {
        this.size = size;
        this.genes = [];
        this.maxSpeed = 4;
        for (let i = 0; i < size; i++) {
            this.genes.push(this.randomVec2(this.maxSpeed));
        }
    }

    randomVec2(maxSpeed) {
        return new Vector2((Math.random() * maxSpeed) - (maxSpeed / 2), (Math.random() * maxSpeed) - (maxSpeed / 2));
    }
}