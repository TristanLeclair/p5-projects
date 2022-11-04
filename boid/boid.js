class Boid {
  constructor() {
    this.position = createVector(random(width), random(height));
    this.velocity = p5.Vector.random2D();
    this.velocity.setMag(random(2, 4));
    this.acceleration = createVector();
    this.maxForce = 0.2;
    this.maxSpeed = 5;
    this.separationPerception = 24;
    this.cohesionPerception = 50;
    this.alignPerception = 25;
  }

  edges() {
    if (this.position.x > width) {
      this.position.x = 0;
    } else if (this.position.x < 0) {
      this.position.x = width;
    }
    if (this.position.y > height) {
      this.position.y = 0;
    } else if (this.position.y < 0) {
      this.position.y = height;
    }
  }

  distance(otherPos) {
    return dist(this.position.x, this.position.y, otherPos.x, otherPos.y);
  }

  align(boids) {
    let steering = createVector();
    let total = 0;
    for (let other of boids) {
      let d = this.distance(other.position);
      if (other != this && d < this.perception) {
        steering.add(other.velocity);
        total++;
      }
    }
    if (total > 0) {
      steering.div(total);
      steering.setMag(this.maxSpeed);
      steering.sub(this.velocity);
      steering.limit(this.maxForce);
    }
    return steering;
  }

  cohesion(boids) {
    let steering = createVector();
    let total = 0;
    for (let other of boids) {
      let d = this.distance(other.position);
      if (other != this && d < this.perception) {
        steering.add(other.position);
        total++;
      }
    }
    if (total > 0) {
      steering.div(total);
      steering.sub(this.position);
      steering.setMag(this.maxSpeed);
      steering.sub(this.velocity);
      steering.limit(this.maxForce);
    }
    return steering;
  }

  separation(boids) {
    let steering = createVector();
    let total = 0;
    for (let other of boids) {
      let d = this.distance(other.position);
      if (other != this && d < this.perception) {
        let diff = p5.Vector.sub(this.position, other.position);
        diff.div(d);
        steering.add(diff);
        total++;
      }
    }
    if (total > 0) {
      steering.div(total);
      steering.setMag(this.maxSpeed);
      steering.sub(this.velocity);
      steering.limit(this.maxForce);
    }
    return steering;
  }

  all3(boids) {
    let alignSteering = createVector();
    let cohesionSteering = createVector();
    let separationSteering = createVector();
    let totalInCohesionView = 0;
    let totalInAlignView = 0;
    let totalInSeparationView = 0;

    for (let other of boids) {
      if (other == this) break;

      let d = this.distance(other.position);


      // Separation
      if (d < this.separationPerception) {
        let diff = p5.Vector.sub(this.position, other.position);
        diff.div(d);
        separationSteering.add(diff);
        totalInSeparationView++;
      }

      // Alignment
      if (d < this.alignPerception) {
        alignSteering.add(other.velocity);
        totalInAlignView++;
      }

      // Cohesion
      if (d < this.cohesionPerception) {
        cohesionSteering.add(other.position);
        totalInCohesionView++;
      }
    }

    if (totalInSeparationView > 0) {
      separationSteering.div(totalInSeparationView);
      separationSteering.setMag(this.maxSpeed);
      separationSteering.sub(this.velocity);
      separationSteering.limit(this.maxForce);
    }
    if (totalInAlignView > 0) {
      alignSteering.div(totalInAlignView);
      alignSteering.setMag(this.maxSpeed);
      alignSteering.sub(this.velocity);
      alignSteering.limit(this.maxForce);
    }
    if (totalInCohesionView > 0) {
      cohesionSteering.div(totalInCohesionView);
      cohesionSteering.sub(this.position);
      cohesionSteering.setMag(this.maxSpeed);
      cohesionSteering.sub(this.velocity);
      cohesionSteering.limit(this.maxForce);
    }
    return {
      separationSteering,
      cohesionSteering,
      alignSteering,
    };
  }

  flock(boids) {
    let alignment = this.align(boids);
    let cohesion = this.cohesion(boids);
    let separation = this.separation(boids);

    alignment.mult(alignSlider.value());
    cohesion.mult(cohesionSlider.value());
    separation.mult(separationSlider.value());

    this.acceleration.add(separation);
    this.acceleration.add(cohesion);
    this.acceleration.add(alignment);

  }
  
  flockAll3 (boids) {
    let steerings = this.all3(boids);

    steerings.alignSteering.mult(alignSlider.value());
    steerings.cohesionSteering.mult(cohesionSlider.value());
    steerings.separationSteering.mult(separationSlider.value());

    this.acceleration.add(steerings.separationSteering);
    this.acceleration.add(steerings.cohesionSteering);
    this.acceleration.add(steerings.alignSteering);
  }

  update() {
    this.position.add(this.velocity);
    this.velocity.add(this.acceleration);
    this.velocity.limit(this.maxSpeed);
    this.acceleration.mult(0);
  }

  show() {
    strokeWeight(6);
    stroke(255);
    point(this.position.x, this.position.y);
    

    // triangle(this.position.x, this.position.y, this.position.x - this.velocity.x, this.position.y, this.position.x, this.position.y -20);

  }
}
