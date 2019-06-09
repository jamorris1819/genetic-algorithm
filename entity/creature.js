class Creature extends LivingEntity {
    constructor(position, dna) {
        super(position);
        var hiddenLayers = this.setupDNA(dna);   
        this.initialise(position);
        this.generatePattern(hiddenLayers);
        this.body = new BodyPart(hiddenLayers, this.DNA.size);
    }

    /**
     * Initialise important variables.
     */
    initialise(position) {
        this.velocity = 1;
        this.type = EntityType.CREATURE;
        this.debug = false;
        this.target = null;
        this.data = null;
        this.initPosition = position;

        this.rotation = Math.random() * Math.PI * 2;
        this.reproduce = false;
        this.reproduceClock = 0; 
        this.maxSpeed = this.DNA.speed;

        this.maxEnergy = 400 * (this.DNA.size * this.DNA.size * this.DNA.size);
        this.energy = this.maxEnergy;
    }

    /**
     * Initialises the DNA if it doesn't exist, and sets it if it does.
     * @param {Object} dna 
     */
    setupDNA(dna) {
        var hiddenLayers;
        if(dna === undefined){
            var tempDNA = new DNA([]);
            var brainSetup = tempDNA.getCharData();
            hiddenLayers = brainSetup["hiddenLayers"];
            this.brain = new Brain(13, hiddenLayers, 3);
            this.DNA = new DNA(this.brain.network.toJSON(), brainSetup);
        }
        else {
            this.DNA = dna;
            hiddenLayers = dna.getCharData()["hiddenLayers"];
            this.brain = new Brain(dna);
        }

        return hiddenLayers;
    }

    /**
     * Generates the pattern of the creature.
     */
    generatePattern(hiddenLayers) {
        var id = "";
        for(var i = 0; i < hiddenLayers.length; i++) {
            id += hiddenLayers[i].toString();
        }
        var pattern = GeoPattern.generate(id);
        this.pattern = new Image();
        this.colour = new Colour(pattern.color);
        this.pattern.src = pattern.toDataUri();
    }

    draw(context) {
        context.save();
        context.fillStyle = context.createPattern(this.pattern, "repeat");
        context.strokeStyle = colourDarken(this.colour).toStyle();
        this.body.draw(context, this.position, this.rotation);
        context.restore();
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
                this.energy += this.maxEnergy * 0.25;
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

        var dangerEntities = entities[1].sort(function(a,b) {
            return a[1]["distance"] - b[1]["distance"];
        }).filter(x => x[1]["visible"]);

        var otherEntities = entities[2].sort(function(a,b) {
            return a[1]["distance"] - b[1]["distance"];
        }).filter(x => x[1]["visible"]);

        var closestDanger, dangerDistance, dangerColour;

        if(dangerEntities.length > 0) {
            closestDanger = dangerEntities[0];
            dangerDistance = closestDanger[1]["distance"];
            dangerColour = closestDanger[0].colour;
        } else {
            dangerDistance = 0;
            dangerColour = new Colour(0, 0, 0);
        }

        var normDangerDistance = (this.DNA.viewDistance - dangerDistance) / this.DNA.viewDistance;

        if(edibleEntities.length === 0) {
            return {
                distance: 0, // Normalised distance to nearest food.
                angle: 0,      // Normalised angle to nearest food.
                focus: 0,     // Whether nearest food is in focused vision.
                // Colour of the nearest edible food.
                edibleR: 0,
                edibleG: 0,
                edibleB: 0,
                // Colour of the nearest dangerous entity.
                dangerR: dangerColour.r / 255,
                dangerG: dangerColour.g / 255,
                dangerB: dangerColour.b / 255,
                dangerDistance: normDangerDistance,
                energy: this.energy / this.maxEnergy,
                timeAlive: this.timeAlive / 100,
                velocity: this.velocity / this.maxSpeed,
                outsideArea: this.outsideArea ? 1 : 0
           }
        }

        var closestEdible = edibleEntities[0];
        var distance = closestEdible[1]["distance"];
        var angle = closestEdible[1]["angle"];

        if(this.debug) closestEdible.seen = true;
        this.target = closestEdible;

        var normDistance = (this.DNA.viewDistance - distance) / this.DNA.viewDistance;
        var newAngle = angle * 2 / this.DNA.fov;
        //newAngle *= (angle > 0) ? 1 : -1;
        var focus = Math.abs(angle) > this.DNA.peripheralFov ? 0 : 1;
        var edibleColour = closestEdible[0].colour;

        return {
            distance: normDistance, // Normalised distance to nearest food.
            angle: newAngle,      // Normalised angle to nearest food.
            focus: focus,     // Whether nearest food is in focused vision.
            // Colour of the nearest edible food.
            edibleR: edibleColour.r / 255,
            edibleG: edibleColour.g / 255,
            edibleB: edibleColour.b / 255,
            // Colour of the nearest dangerous entity.
            dangerR: dangerColour.r / 255,
            dangerG: dangerColour.g / 255,
            dangerB: dangerColour.b / 255,
            dangerDistance: normDangerDistance,
            energy: this.energy / this.maxEnergy,
            timeAlive: this.timeAlive / 100,
            velocity: this.velocity / this.maxSpeed,
            outsideArea: this.outsideArea ? 1 : 0
       };
    }

    act(decision, deltaTime) {
        // Choose turning angle.
        this.rotation += deltaTime * (decision[1] - decision[0]);
        // If forward decision is at least 0.15 then move forward.
        this.velocity = decision[2] > 0.15 ? decision[2] * this.maxSpeed : 0;
    }

    /**
     * Processes all the entities available to it, and returns a list of edible & non-edible entites.
     * @param {Object[]} entities 
     */
    processVision(entities) {
        var viewData = null;
        var edibleEntities = [];    // Entities which can be eaten.
        var dangerEntities = [];    // Entities which pose danger.
        var otherEntities = [];     // Everything else.

        // Process entities.
        for(var i = 0; i < entities.length; i++) {
            viewData = this.view(entities[i]);

            var data = [entities[i], viewData].flat();
            
            if(viewData["distance"] === 0) continue;

            if(entities[i].type === EntityType.PLANT || entities[i].DNA.size < this.DNA.size * 0.5) {
                edibleEntities.push(data);
            }
            else if(entities[i].DNA.size > this.DNA.size * 1.5) {
                dangerEntities.push(data);
            }
            else {
                otherEntities.push(data);
            }
        }

        // Save entities.
        return [edibleEntities, dangerEntities, otherEntities];
    }

    /**
     * Calculate whether an object is in view, and if so what it's angle & distance is.
     * @param {Object} entity 
     */
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