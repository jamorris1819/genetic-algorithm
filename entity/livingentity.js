class LivingEntity extends Entity {
    constructor(position) {
        super(position);

        // Define needs.
        this.maxEnergy = 100;
        this.energy = this.maxEnergy;
        this.invincible = false;
        this.alive = true;
        this.timeAlive = 0;
        this.totalEaten = 0;
        this.DNA = new DNA(null);
        this.outsideArea = false;

        this.colour = new Colour(0, 0, 0);
    }

    update(deltaTime) {
        if(!this.alive) return; 

        if(this.energy > this.maxEnergy) this.energy = this.maxEnergy;

        this.timeAlive += deltaTime;
        super.update(deltaTime);

        if(this.invincible) {
            // Entities with energy set to -1 are invincible.
            return;
        }
        
        // Calculate energy use.
        var energyCost = this.cost();
        this.energy -= energyCost;

        // If energy is 0 then die.
        if(this.energy <= 0) {
            this.energy = 0;
            this.alive = false;
        }
    }

    /**
     * Calculate energy cost.
     */
    cost() {
        var velocity = this.velocity * this.velocity;
        var size = this.DNA.size * this.DNA.size * this.DNA.size;

        var cost = ((velocity + 5) * size) * 0.00045;
        if(this.outsideArea) cost *= 3.5;

        return cost;
    }
}