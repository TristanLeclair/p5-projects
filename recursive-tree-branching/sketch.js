const MIN_LEN = 50

var slider
function setup() {
	let angle = QUARTER_PI
	createCanvas(windowWidth, windowHeight-50);
	slider = createSlider(0, TWO_PI, QUARTER_PI, 0.01)
	// put setup code here

}

function draw() {
	// put drawing code here
	background(51)
	angle = slider.value()
	stroke(255)
	translate(windowWidth/2, height)
	let len = 200
	branch(len)
}

function branch(len) {
	if(len < MIN_LEN) {
		return;
	}
	line(0, 0, 0, -len);

	push()
	translate(0, -len)
	push()
	rotate(angle)
	branch(len * 0.67)
	pop()
	push()
	rotate(-angle)
	branch(len * 0.67)
	pop()
	pop()


	push()
	translate(0,-len*0.67)
	push()
	rotate(angle/2)
	branch(len * 0.67)
	pop()
	push()
	rotate(-angle/2)
	branch(len * 0.67)
	pop()
	pop()
}
