class Ray {
    constructor(pos, angle) {
        this.pos = pos;
        this.dir = p5.Vector.fromAngle(angle);
    }

    show() {
        stroke(255);
        push();
        translate(this.pos.x, this.pos.y);
        line(0, 0, this.dir.x * 10, this.dir.y * 10);
        pop();
    }

    lookAt(x, y) {
        this.dir.x = x - this.pos.x;
        this.dir.y = y - this.pos.y;
        this.dir.normalize();
    }

    cast(object) {
        const x1 = object.a.x;
        const y1 = object.a.y;
        const x2 = object.b.x;
        const y2 = object.b.y;

        const x3 = this.pos.x;
        const y3 = this.pos.y;
        const x4 = this.pos.x + this.dir.x;
        const y4 = this.pos.y + this.dir.y;

        const denom = (x1 - x2) * (y3 - y4) - (y1 - y2) * (x3 - x4);

        if(denom == 0) {
            return;
        }

        const t = ((x1 - x3) * (y3 - y4) - (y1 - y3) * (x3 - x4)) / denom;

        const u = ((x1 - x3) * (y1 - y2) - (y1 - y3) * (x1 - x2)) / denom;

        
        

        if(0 < t && t < 1 && 0 < u) {
            const pt = createVector();
            pt.x = x1 + t * (x2 - x1);
            pt.y = y1 + t * (y2 - y1);
            return pt;
        } else {
            return;
        }
    }
}