class Dna {
    /**
     * @param {number} size
     */
    constructor(size) {
        this.size = size;
        this.genes = [];
        this.maxAcceleration = 3;
        for (let i = 0; i < size; i++) {
            this.genes.push(this.randomVec2(this.maxAcceleration));
        }
    }

    randomVec2(maxAcceleration) {
        return new Vector2((Math.random() * maxAcceleration) - (maxAcceleration / 2), (Math.random() * maxAcceleration) - (maxAcceleration / 2));
    }
}