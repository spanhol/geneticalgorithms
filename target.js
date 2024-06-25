class Target {
    /**
     * @param {number} x 
     * @param {number} y
     * @param {number} width 
     * @param {number} height 
     * @param {string} color
     */
    constructor(x, y, width, height, color) {
        this.x = x;
        this.y = y;
        this.width = width;
        this.height = height;
        this.color = color;
    }

    checkCollision(entity) {
        if ((entity.x > this.x) &&
            (entity.x < this.x + this.width) &&
            (entity.y > this.y) &&
            (entity.y < this.y + this.height)) {
            return true;
        }
        return false;
    }
}