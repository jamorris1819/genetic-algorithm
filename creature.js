class Creature extends LivingEntity {
    constructor(position) {
        super(position);
        this.velocity = 1;
        this.maxSpeed = 100;
    }

    draw(context) {
        context.beginPath();
		context.arc(this.position.getX(), this.position.getY(), this.size, 0, 2 * Math.PI);
		context.fillStyle = "green";
		context.fill();
    }

    update(deltaTime) {
        this.velocity = this.maxSpeed;
        super.update(deltaTime);
    }
}