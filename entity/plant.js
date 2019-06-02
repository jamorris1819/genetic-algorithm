class Plant extends LivingEntity {
    constructor(position) {
        super(position);
        this.type = EntityType.PLANT;
        this.seen = false;
        this.colour = new Colour(0, 255, 0);
        this.maxEnergy = -1;
    }

    draw(context) {
        context.beginPath();
		context.arc(this.position.getX(), this.position.getY(), this.DNA.size, 0, 2 * Math.PI);
		context.fillStyle = this.seen ? "pink" : this.colour.toStyle();
		context.fill();
    }
}