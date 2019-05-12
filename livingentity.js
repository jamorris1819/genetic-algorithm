class LivingEntity extends Entity {
    constructor(position) {
        super(position);

        // Define needs.
        this.maxEnergy = 100;
        this.energy = this.maxEnergy;
        this.alive = true;
        this.timeAlive = 0;
        this.DNA = new DNA(null);
    }

    update(deltaTime) {
        if(!this.alive) return; 

        this.timeAlive += deltaTime;
        super.update(deltaTime);

        // Calculate energy use.
        var energyCost = deltaTime * (1 + (this.velocity / 20));
        this.energy -= energyCost;

        // If energy is 0 then die.
        if(this.energy <= 0) {
            this.energy = 0;
            this.alive = false;
        }
    }
}