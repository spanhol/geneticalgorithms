class Vector2 {
    /**
     * @param {number} x
     * @param {number} y
     */
    constructor(x, y) {
        this.x = x;
        this.y = y;
    }

    add(other) {
        return new Vector2(this.x + other.x, this.y + other.y);
    }

    subtract(other) {
        return new Vector2(this.x - other.x, this.y - other.y);
    };

    multiply(scalar) {
        return new Vector2(this.x * scalar, this.y * scalar);
    };

    magnitude() {
        return Math.sqrt(this.x * this.x + this.y * this.y);
    };

    normalize() {
        const mag = this.magnitude();
        if (mag > 0) {
            this.x /= mag;
            this.y /= mag;
        }
    };
}