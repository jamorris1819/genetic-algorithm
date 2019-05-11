var lastTime = 0; // Used for delta time.
var creature;

window.onload = function(){
	canvas = document.getElementById('gc');
	context = canvas.getContext("2d");

	initialise();
	gameLoop();
};

function initialise() {
    lastTime = Date.now();
    creature = new Creature(new Vector(500, 500));
}

function gameLoop() {
    // Calculate deltaTime
    var thisTime, deltaTime;
    thisTime = Date.now();
    deltaTime = thisTime - lastTime;
    deltaTime /= 1000;
    lastTime = thisTime;

    update(deltaTime);
    draw();

    requestAnimationFrame(gameLoop);
}

function update(deltaTime) {
    creature.update(deltaTime);
}

function draw() {
    // Fill background
    context.fillStyle = '#333333';
    context.fillRect(0, 0, canvas.width, canvas.height);
    
    creature.draw(context);
}