const EntityType = {
	UNKNOWN: -1,
	CREATURE: 0,
	PLANT: 1
}

class Entity {
    constructor(position) {
        this.position = position;
        this.velocity = 1;
        this.rotation = 0;
    }    

    setPosition(position) {
        this.position = position;
    }

    getPosition() {
        return this.position;
    }

	setVelocity(velocity) {
		this.velocity = velocity;
	}

	getVelocity() {
		return this.velocity;
    }
    
    update(deltaTime) {
        // Move
        var directionVector = (new Vector(1, 0)).rotate(this.rotation);
        this.position = this.position.add(directionVector.multiply(deltaTime * this.velocity));

        // Keep rotation between 0 and 2PI
        while (this.rotation > 2 * Math.PI) this.rotation -= Math.PI * 2;
        while (this.rotation < 0) this.rotation += Math.PI * 2;
    }
}