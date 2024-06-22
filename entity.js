class Entity {
    /**
     * @param {number} x 
     * @param {number} y 
     * @param {number} size 
     * @param {string} color 
     * @param {Dna} dna 
     */
    constructor(x, y, size, color, dna) {
        this.x = x;
        this.y = y;
        this.dna = dna;
        this.size = size;
        this.color = color;
    }
}