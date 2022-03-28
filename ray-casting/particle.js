class Particle {
    constructor(numRays) {
        this.pos = createVector(width / 2, height / 2);
        this.agents = [];
        this.setRays(numRays);
        this.wallsOn = true;
    }

    toggleWallRays() {
        this.wallsOn = !this.wallsOn;
    }

    setRays(numRays) {
        this.wallRays = [];
        for(let i = 0; i < 360; i+=(360/numRays)) {
            this.wallRays.push(new Ray(this.pos, radians(i)))
        }
    }

    addAgent(agent) {
        let ray = new Ray(this.pos, 0);
        ray.lookAt(agent.pos.x, agent.pos.y);
        this.agents.push([agent, ray]);
    }

    updatePos(x, y) {
        this.pos.set(x,y);
    }

    look(walls) {
        this.lookBoundaries(walls);
        return this.lookAgents(walls);
    }

    lookBoundaries(walls) {
        if(!this.wallsOn) { return; }

        for(let i = 0; i < this.wallRays.length; i++) {
            const ray = this.wallRays[i];
            let closest = null;
            let isBorder = false;
            let record = Infinity;
            for(let wall of walls) {
                const pt = ray.cast(wall);
                if(pt) {
                    const d = p5.Vector.dist(this.pos, pt);
                    if (d < record) {
                        record = d;
                        closest = pt;
                        isBorder = wall.isBorder;
                    }
                }
            }
            if (closest) {
                isBorder ? stroke(255, 0, 0,100) : stroke(0, 255, 255, 300);
                line(this.pos.x, this.pos.y, closest.x, closest.y);
            }
        }
    }
 
    lookAgents(walls) {
        let agentsInSight = 0;
        for(let agentTuple of this.agents) {
            let agent = agentTuple[0];
            let agentRay = agentTuple[1];

            let closest = null;
            let record = p5.Vector.dist(this.pos, agent.pos);
            agentRay.lookAt(agent.pos.x, agent.pos.y);
            for(let wall of walls) {
                const pt = agentRay.cast(wall);
                if(pt) {
                    const d = p5.Vector.dist(this.pos, pt);
                    if (d < record) {
                        record = d;
                        closest = pt;
                    }
                }
            }
            closest ? stroke(255, 0, 0,100) : stroke(0, 255, 0, 300);
            if(!closest) agentsInSight++;
            line(this.pos.x, this.pos.y, agent.pos.x, agent.pos.y);
        }
        return agentsInSight;
    }

    show() {
        fill(255);
        ellipse(this.pos.x, this.pos.y, 4, 4);
        for (let ray of this.wallRays) {
            ray.show();          
        }
    }
}