class Plant extends LivingEntity {
    constructor(position) {
        super(position);
        this.type = EntityType.PLANT;
        this.seen = false;
    }

    draw(context) {
        context.beginPath();
		context.arc(this.position.getX(), this.position.getY(), this.DNA.size, 0, 2 * Math.PI);
		context.fillStyle = this.seen ? "pink" : "green";
		context.fill();
    }
}