class EntityManager {
    static entities = [];
    static dnaScores = [];

    static createCreature(position) {
        if(position === undefined) {
            var padding = 100;
            var x = padding + ((1920 - (padding * 2)) * Math.random());
            var y = padding + ((1080 - (padding * 2)) * Math.random());
            position = new Vector(x, y);
        }
        entities.push(new Creature(position));
    }

    static createCreatureFromDNA(dna, position) {
        if(position === undefined){
            var padding = 100;
            var x = padding + ((1920 - (padding * 2)) * Math.random());
            var y = padding + ((1080 - (padding * 2)) * Math.random());
            position = new Vector(x, y);
        }
        var creature = new Creature(position, dna);

        entities.push(creature);
    }

    static createPlant(position) {
        if(position === undefined) {
            var padding = 100;
            var x = padding + ((1920 - (padding * 2)) * Math.random());
            var y = padding + ((1080 - (padding * 2)) * Math.random());
            position = new Vector(x, y);
        }
        var plant = new Plant(position)
        plant.DNA.size = 4;

        entities.push(plant);
    }

    static getEntities() {
        return entities;
    }

    static update(deltaTime) {
        for(var i = 0; i < entities.length; i++) {
            entities[i].update(deltaTime, entities);

            if (entities[i].type === EntityType.CREATURE) {
                if(entities[i].reproduce) {
                    entities[i].reproduce = false;

                    var DNA = entities[i].DNA.clone();
                    this.createCreatureFromDNA(DNA, entities[i].position);
                }
            }
        }

        if(entities.length > 0) {
            
            var filter = entities.filter(x => x.type === EntityType.CREATURE);
            if(filter.length > 0) filter[0].debug = true;
        }

        // Make sure there are enough plants.
        /*var plantCount = entities.filter(x => x.type == EntityType.PLANT);
        if(plantCount.length < 20) {
            for(var i = 0; i < 30 - plantCount.length; i++) {
                this.createPlant();
            }
        }

        // Spawn creatures
        var creatureCount = entities.filter(x => x.type == EntityType.CREATURE);
        if(creatureCount.length < 10) {
            for(var i = 0; i < 10 - creatureCount.length; i++) {
                this.createCreature();
            }
        }

        // Remove the dead
        this.processDead();*/
    }

    static saveDNA(dna, score) {
        this.dnaScores.push([dna, score]);
        this.dnaScores.sort(function(a, b) {
            return b[1] - a[1];
        })
    }

    static processDead() {
        var dead = entities.filter(x => !x.alive && x.type == EntityType.CREATURE);
        entities = entities.filter(x => x.alive);

        for(var i = 0; i < dead.length; i++) {
            this.saveDNA(dead[i].DNA, dead[i].timeAlive);
        }
    }

    static draw(context) {
        for(var i = 0; i < entities.length; i++) {
            entities[i].draw(context);
        }
    }
}