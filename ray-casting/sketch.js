let _img;
let _xoffParticle = 0;
let _yoffParticle = 10000;
let _particleSpeed = 100;
let _agentSpeed = 100;
let _walls = [];
let _ray;
let _particle;
const _NUM_INSIDE_WALLS = 5;
const _NUM_RAYS = 100;
const _NUM_RAYS_BOUNDARIES = 30;

let _boundaryWalls;

let _boundariesEnabled = false;

const _COUNTDOWN = 5;
let _count = _COUNTDOWN;
let _drawModeOn = false;
let _firstClicked = false;
const _drawFirstMessage = 'Click anywhere to select wall start';
const _drawSecondMessage = 'Click anywhere to select wall end';
let _newWallx1;
let _newWally1;
let _newWallx2;
let _newWally2;

let _agents = [];



function preload() {
	//_img = loadImage('');
}

function setup() {
	createCanvas(windowWidth, windowHeight);
	// put setup code here
	console.log(_particleSpeed);
	background(100);
	//image(_img, 0, 0);
	setupUI();
	_particleSpeed = map(_particleSpeed, 0, 100, 0.0001, 0.01);
	_agentSpeed = map(_agentSpeed,0, 100, 0.00001, 0.001);

	_particle = new Particle(_NUM_RAYS);

	for (let i = 0; i < _NUM_INSIDE_WALLS; i++) {
		addWall();
	}	
	
	_boundaryWalls = [
		new Boundary(0,0,width,0,true),
		new Boundary(width,0,width,height, true),
		new Boundary(width,height,0,height, true),
		new Boundary(0,height,0,0, true)
	];
	
}

function setupUI() {
	let buttons = [];

	let boundaryButton = createButton('toggle boundaries');
	boundaryButton.mousePressed(triggerBoundaries);

	let wallButton = createButton('toggle walls');
	wallButton.mousePressed(toggleWalls);

	let addAgentButton = createButton('add agent');
	addAgentButton.mousePressed(addAgent);

	let addWallButton = createButton('add random wall');
	addWallButton.mousePressed(addWall);

	let drawWallButton = createButton('draw wall');
	drawWallButton.mouseReleased(drawWall);

	let deleteAgentsButton = createButton('delete agents');
	deleteAgentsButton.mouseClicked(deleteAgents);

	
	buttons.push(boundaryButton, wallButton, addAgentButton, deleteAgentsButton, addWallButton, drawWallButton);
	positionButtons(buttons);
}

function positionButtons(buttons) {
	for (let i = 0; i < buttons.length; i++) {
		const button = buttons[i];
		button.position(0, i * 30);
	}
}

function deleteAgents() {
	_agents = [];
	_particle.deleteAgents();
}


function addWall() {
	let x1 = random(width);
	let x2 = random(width);
	let y1 = random(height-10);
	let y2 = random(height-10);
	_walls.push(new Boundary(x1,x2,y1,y2));
}

function drawWall() {
	_drawModeOn = true;
}

function toggleWalls() {
	_particle.toggleWallRays();
}

function addAgent() {
	let newAgent = new Agent();
	newAgent.updatePos()
	_agents.push(newAgent);
	_particle.addAgent(newAgent);
}

function triggerBoundaries() {
	_boundariesEnabled = !_boundariesEnabled;
	updateParticle();
}

function updateParticle() {
	let numRays = _boundariesEnabled ? _NUM_RAYS_BOUNDARIES : _NUM_RAYS;
	_particle.setRays(numRays);
}

function mouseClicked() {
	if(_drawModeOn && _count < 1) {
		if(!_firstClicked && mouseButton === LEFT) {
			_newWallx1 = mouseX;
			_newWally1 = mouseY;
			_firstClicked = true;
		}
		else {
			_newWallx2 = mouseX;
			_newWally2 = mouseY;
			_walls.push(new Boundary(_newWallx1, _newWally1, _newWallx2, _newWally2));
			_firstClicked = false;
			_drawModeOn = false;
			_count = _COUNTDOWN;
		}

	}
}

function draw() {
	// put drawing code here
	background(0);
	if(_drawModeOn) {
		let message = _firstClicked ? _drawSecondMessage : _drawFirstMessage;
		text('Draw mode is on\n ' + message, 300, 30);
		if(_count > 0) {
			_count--;
		}
	}

	for(let wall of getWalls()) {
		wall.show();
	}
	_particle.show();

	for(let agent of _agents) {
		agent.show();
		agent.offsetX += _agentSpeed;
		agent.offsetY += _agentSpeed;
		let nx = noise(agent.offsetX) * width;
		let ny = noise(agent.offsetY) * height;
		agent.updatePos(nx, ny);
	}
	let nbAgents = _particle.look(getWalls());

	_xoffParticle+= _particleSpeed;
	_yoffParticle+= _particleSpeed;
	let nx = noise(_xoffParticle) * width;
	let ny = noise(_yoffParticle) * height;
	_particle.updatePos(nx,ny);
	fill(255);	
	textSize(15)
	text('Number of agents in view: ' + nbAgents, 300, 15);
	
}

function getWalls() {
	const result = _boundariesEnabled ? [..._walls, ..._boundaryWalls] : _walls;
	return result;
}
