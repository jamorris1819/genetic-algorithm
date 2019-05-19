class Creature extends LivingEntity {
    constructor(position, dna) {
        super(position);
        this.velocity = 1;
        this.type = EntityType.CREATURE;
        this.debug = false;
        this.target = null;
        this.data = null;
        this.initPosition = position;

        this.rotation = Math.random() * Math.PI * 2;
        this.reproduce = false;
        this.reproduceClock = 0;

        var hiddenLayers;

        if(dna === undefined){
            var tempDNA = new DNA([]);
            var brainSetup = tempDNA.getCharData();
            hiddenLayers = brainSetup["hiddenLayers"];
            this.brain = new Brain(7, hiddenLayers, 3);
            this.DNA = new DNA(this.brain.network.toJSON(), brainSetup);
        }
        else {
            this.DNA = dna;
            hiddenLayers = dna.getCharData()["hiddenLayers"];
            this.brain = new Brain(dna);
        }
        
        this.maxEnergy = 300;
        this.energy = this.maxEnergy;
        this.maxSpeed = this.DNA.speed;

        var id = "";
        for(var i = 0; i < hiddenLayers.length; i++) {
            id += hiddenLayers[i].toString();
        }
        var pattern = GeoPattern.generate(id);
        this.pattern = new Image();
        this.pattern.src = pattern.toDataUri();
    }

    draw(context) {
        context.beginPath();
        context.fillStyle = context.createPattern(this.pattern, "repeat");
		context.arc(this.position.getX(), this.position.getY(), this.DNA.size, 0, 2 * Math.PI);
        var offset = this.initPosition.subtract(this.position);
        context.translate(-offset.getX(), -offset.getY());
		context.fill();
        context.translate(offset.getX(), offset.getY());
    }

    update(deltaTime, entities) {
        this.velocity = this.maxSpeed;
        super.update(deltaTime);

        // Process the world.
        var visionData = this.processVision(entities);
        this.checkForFood(visionData[0]);
        var processingData = this.think(visionData);
        var decisionData = this.brain.process(processingData);
        this.data = [processingData, decisionData];
        this.act(decisionData, deltaTime);

        if(this.reproduceClock > 30 && this.totalEaten > 2) {
            this.reproduce = true;
            this.reproduceClock = 0;
            this.totalEaten = 0;
        } else {
            this.reproduceClock += deltaTime;
        }
    }

    checkForFood(edibleEntities) {
        for(var i = 0; i < edibleEntities.length; i++) {
            if(edibleEntities[i][1]["distance"] < this.DNA.size * 1.5) {
                // Eat
                this.energy = this.maxEnergy;
                console.log("Food was eaten");
                this.totalEaten++;
                edibleEntities[i][0].alive = false;
            }
        }
    }

    think(entities) {
        this.target = null;
        var edibleEntities = entities[0].sort(function(a,b) {
            return a[1]["distance"] - b[1]["distance"];
        }).filter(x => x[1]["visible"]);
        var otherEntities = entities[1];

        if(edibleEntities.length === 0) return [0, 0];

        var closestEdible = edibleEntities[0];
        var distance = closestEdible[1]["distance"];
        var angle = closestEdible[1]["angle"];

        if(this.debug) closestEdible.seen = true;
        this.target = closestEdible;

        var normDistance = (this.DNA.viewDistance - distance) / this.DNA.viewDistance;
        var aLeft = (angle < 0) ? Math.abs(angle) / this.DNA.peripheralFov : 0;
        var aRight = (angle > 0) ? Math.abs(angle) / this.DNA.peripheralFov : 0;
        var focus = Math.abs(angle) > this.DNA.peripheralFov ? 0 : 1;

        return [
            normDistance, // Normalised distance to nearest food.
            aLeft,
            aRight,      // Normalised angle to nearest food.
            focus,     // Whether nearest food is in focused vision.
            this.energy / this.maxEnergy,
            this.timeAlive / 100,
            this.velocity / this.maxSpeed
        ];
    }

    act(decision, deltaTime) {
        // Choose turning angle.
        this.rotation += deltaTime * (decision[1] - decision[0]);
        this.velocity = decision[2] > 0.15 ? decision[2] * this.maxSpeed : 0;
    }

    processVision(entities) {
        var viewData = null;
        var edibleEntities = [];
        var otherEntities = [];

        // Process entities.
        for(var i = 0; i < entities.length; i++) {
            viewData = this.view(entities[i]);

            var data = [entities[i], viewData].flat();
            
            if(viewData["distance"] === 0) continue;

            if(entities[i].type === EntityType.PLANT || entities[i].DNA.size < this.DNA.size * 0.5) {
                edibleEntities.push(data);
            }
            else {
                otherEntities.push(data);
            }
        }

        // Save entities.
        return [edibleEntities, otherEntities];
    }

    view(entity) {
        var positionDelta = entity.position.subtract(this.position);
        var direction = (new Vector(1, 0)).rotate(this.rotation);

        var distance = positionDelta.magnitude();
        positionDelta = positionDelta.normalise();

        var dot = positionDelta.getX() * direction.getX() + positionDelta.getY() * direction.getY();
        var det = positionDelta.getX() * direction.getY() - positionDelta.getY() * direction.getX();

        var angle = Math.atan2(det, dot) * -1; // Positive is right
        var inView = (Math.abs(angle) <= this.DNA.fov / 2)
            && distance <= this.DNA.viewDistance;

        return {
            visible: inView,
            angle: angle,
            distance, distance
        };
    }    
}