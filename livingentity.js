class LivingEntity extends Entity {
    constructor(position) {
        super(position);

        // Define needs.
        this.energy = 100;
        this.alive = true;
        this.timeAlive = 0;
        this.size = 10;
    }

    update(deltaTime) {
        if(!this.alive) return; 

        super.update(deltaTime);

        // Calculate energy use.
        var energyCost = deltaTime * (1 + (this.velocity / 20));
        this.energy -= energyCost;
        console.log(this.energy);
        // If energy is 0 then die.
        if(this.energy <= 0) {
            this.energy = 0;
            this.alive = false;
        }
    }
}