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
    }
}