const flock = [];

let alignSlider, cohesionSlider, separationSlider;

function setup() {
  createCanvas(windowWidth, windowHeight - 30);
  alignSlider = createSlider(0, 5, 1, 0.1);
  cohesionSlider = createSlider(0, 5, 1, 0.1);
  separationSlider = createSlider(0, 5, 1, 0.1);
  // put setup code here
  for (let i = 0; i < 150; i++) {
    flock.push(new Boid());
  }
}

function draw() {
  // put drawing code here
  background(51);

  for (let boid of flock) {
    boid.edges();
    // boid.flock(flock);
    boid.flockAll3(flock);
    boid.update();
    boid.show();
  }
}
