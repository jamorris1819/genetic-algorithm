var lastTime = 0; // Used for delta time.
var entities = [];

window.onload = function(){
	canvas = document.getElementById('gc');
	context = canvas.getContext("2d");

	initialise();
	gameLoop();
};

function initialise() {
    lastTime = Date.now();

    //EntityManager.createCreature(new Vector(300, 300));
    //EntityManager.createPlant(new Vector(400, 300));
	for(var i = 0; i < 20; i++) {
		EntityManager.createCreature();
	}
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
    EntityManager.update(deltaTime);
}

function draw() {
    // Fill background
    context.fillStyle = '#333333';
    context.fillRect(0, 0, canvas.width, canvas.height);
    
    EntityManager.draw(context);
    renderInfo();
}

function renderInfo() {
    // Select the oldest creature.
    var entities = EntityManager.getEntities().filter(x => x.type == EntityType.CREATURE);
    if(entities.length === 0) return;
    var creature = entities[0];

    // Render line between creature and it's closest food.
    if(creature.target !== null && creature.target !== undefined) {
        context.beginPath();
        context.moveTo(creature.position.getX(), creature.position.getY());
        context.lineTo(creature.target[0].position.getX(), creature.target[0].position.getY());
        context.stroke();
    }
    
    // Render the view of a creature.
    renderCone(creature);

    // Render over the creature so we know which one it is.
    context.beginPath();
    context.arc(creature.position.getX(), creature.position.getY(), creature.DNA.size, 0, 2 * Math.PI);
    context.fillStyle = "white";
    creature.draw(context)
    // Render some data.
    context.fillStyle = '#DEDEDE';
	context.font = "30px Arial";
	context.fillText("Creature Data", 50, 50);

	var posX = Math.floor(creature.position.getX());
	var posY = Math.floor(creature.position.getY());
	var rot = Math.floor(creature.rotation * (180 / Math.PI));

	context.font = "20px Arial";
	context.fillText("Pos : { X: " + posX + ", Y: " + posY+" }", 50, 90);
    context.fillText("Rot : " + rot, 50, 120);
    
    var data = creature.data;

    if(data !== null) {
        var dist = data[0][0];
        var ang = data[0][1];
        
        context.fillText("Dist : " + dist, 50, 150);
        context.fillText("Angl : " + ang, 50, 180);
        context.fillText("Ener : " + creature.energy, 50, 210);
    }
}

function renderCone(creature) {
    context.fillStyle = "rgba(255, 255, 255, 0.2)";

	var length = creature.DNA.viewDistance;
	var leftPoint = (new Vector(length, 0)).rotate(creature.rotation - (creature.DNA.fov / 2));
	var rightPoint = (new Vector(length, 0)).rotate(creature.rotation + (creature.DNA.fov / 2));

	var p1 = creature.position;
	var p2 = creature.position.add(leftPoint);
	var p3 = creature.position.add(rightPoint);

	context.beginPath();
	context.moveTo(p1.getX(), p1.getY());
	context.lineTo(p2.getX(), p2.getY());
	context.lineTo(p3.getX(), p3.getY());
    context.fill();
    
    context.fillStyle = "rgba(255, 0, 0, 0.2)";
    leftPoint = (new Vector(length, 0)).rotate(creature.rotation - (creature.DNA.peripheralFov / 2));
	rightPoint = (new Vector(length, 0)).rotate(creature.rotation + (creature.DNA.peripheralFov / 2));

	p1 = creature.position;
	p2 = creature.position.add(leftPoint);
	p3 = creature.position.add(rightPoint);

	context.beginPath();
	context.moveTo(p1.getX(), p1.getY());
	context.lineTo(p2.getX(), p2.getY());
	context.lineTo(p3.getX(), p3.getY());
	context.fill();
}