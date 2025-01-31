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
        this.x = this.x + other.x;
        this.y = this.y + other.y;
    }

    subtract(other) {
        this.x = this.x - other.x;
        this.y = this.y - other.y;
    };

    multiply(scalar) {
        this.x = this.x * scalar;
        this.y = this.y * scalar;
    };

    magnitude() {
        return Math.sqrt(this.x * this.x + this.y * this.y);
    };

    normalize() {
        let x = this.x;
        let y = this.y;
        const mag = this.magnitude();
        if (mag > 0) {
            x = x / mag;
            y = y / mag;
        }
        if (mag == 0) {
            x = 0;
            y = 1;
        }
        return new Vector2(x, y);
    };

    distance(other) {
        return Math.sqrt(Math.pow(this.x - other.x, 2) + Math.pow(this.y - other.y, 2))
    }
}