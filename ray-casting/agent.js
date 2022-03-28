class Agent {
    constructor() {
        this.pos = createVector(width / 2, height / 2);
        this.offsetX = random(0, 10000);
        this.offsetY = random(0, 10000);
    }

    updatePos(x, y) {
        this.pos.set(x,y);
    }

    show() {
        fill(255);
        ellipse(this.pos.x, this.pos.y, 4, 4);
    }
}