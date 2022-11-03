const flock = [];

function setup() {
  createCanvas(windowWidth, windowHeight);
  // put setup code here
  for (let i = 0; i < 100; i++) {
    flock.push(new Boid());
  }
}

function draw() {
  // put drawing code here
  background(51);

  for (let boid of flock) {
    boid.edges();
    boid.flock(flock);
    boid.update();
    boid.show();
  }
}
