class Plant extends LivingEntity {
    constructor(position) {
        super(position);
        this.type = EntityType.PLANT;
        this.seen = false;
        var colours = ["#25523B", "#358856", "#5AAB61", "#62BD69", "#30694B", "#0C3823"];
        this.colour = new Colour(colours[Math.floor(Math.random() * colours.length)]);
        this.invincible = true;
        this.DNA.size = 10 + Math.random() * 20;
    }

    draw(context) {
        context.beginPath();
		context.arc(this.position.getX(), this.position.getY(), this.DNA.size, 0, 2 * Math.PI);
        context.fillStyle = this.seen ? "pink" : this.colour.toStyle();
        context.strokeStyle = "black";
        context.stroke();
		context.fill();
    }
}