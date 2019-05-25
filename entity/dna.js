class DNA {
    constructor(brainData, charData) {
        // Data for the neural net.
        this.brainData = brainData;

        // Data for creature characteristics.
        if(charData === undefined) {
            this.generateData();
        }
        else {
            this.size = charData["size"];
            this.fov = charData["fov"];
            this.viewDistance = charData["viewDistance"];
            this.peripheralFov = this.fov / 3;
            this.hiddenLayers = charData["hiddenLayers"];
            this.speed = charData["speed"];
        }
    }

    getCharData() {
        return {
            size: this.mutateGeneChance(this.size),
            fov: this.mutateGeneChance(this.fov),
            viewDistance: this.mutateGeneChance(this.viewDistance),
            peripheralFov: this.peripheralFov,
            hiddenLayers: this.hiddenLayers,
            speed: this.mutateGeneChance(this.speed)
        };
    }

    generateData() {
        this.size = 10;
        this.fov = Math.PI / 2;
        this.peripheralFov = this.fov / 3;
        this.viewDistance = 500;
        this.colorR = 255
        this.colorG = 255;
        this.colorB = 255;
        this.speed = 30;

        this.hiddenLayers = [];
        var hiddenLayerCount = Math.ceil(Math.random() * 4)
        for(var i = 0; i < hiddenLayerCount; i++) {
            this.hiddenLayers.push(Math.ceil(Math.random() * 25));
        }
    }

    clone() {
        var clonedDNA = new DNA(this.brainData, this.getCharData());

        return clonedDNA;
    }

    cross(otherDNA) {
        var copy = this.clone();

        var x = copy.readBrainData();
        var y = otherDNA.readBrainData();

        var weightPoint = Math.floor(Math.random() * x[0].length);
        var biasPoint = Math.floor(Math.random() * y[0].length);

        var crossWeight = [];
        var crossBias = [];

        for(var i = 0; i < x[0].length; i++) {
            crossWeight.push(i < weightPoint ? x[0][i] : y[0][i]);
        }
        for(var i = 0; i < x[1].length; i++) {
            crossBias.push(i < biasPoint ? x[1][i] : y[1][i]);
        }

        copy.writeBrainData(crossWeight, crossBias);

        return copy;
    }

    /**
     * Reads the weights and biases from the neural net.
     */
    readBrainData() {
        var connectionData = this.brainData.connections;
        var connectionWeights = [];

        for(var i = 0; i < connectionData.length; i++) {
            connectionWeights[i] = connectionData[i].weight;
        }

        var biasData = this.brainData.neurons;
        var biases = [];

        for(var i = 0; i < biasData.length; i++) {
            biases[i] = biasData[i].bias;
        }

        return [
            this.mutateSequence(connectionWeights),
            this.mutateSequence(biases)
        ];
    }

    /**
     * Writes the weights and biases from the neural net.
     */
    writeBrainData(connectionWeights, biases) {
        for(var i = 0; i < connectionWeights.length; i++) {
            this.brainData.connections[i].weight = connectionWeights[i];
        }

        for(var i = 0; i < biases.length; i++) {
            this.brainData.neurons[i].bias = biases[i];
        }
    }

    /**
     * Mutates an array of genes.
     * @param {object[]} data - Array of genes
     */
    mutateSequence(data) {
        for(var i = 0; i < data.length; i++) {
            var random = Math.random();
            if(random < 0.4) data[i] = this.mutateGene(data[i], random);
        }

        return data;
    }

    /**
     * Mutates an individual gene.
     * @param {object[]} gene - Array of genes.
     * @param {number} severity - Lower to 0 is more severe.
     */
    mutateGene(gene, severity) {
        var sign = Math.random() < 0.5 ? 1 : -1;
        return gene * (1 + (0.5 - severity) * sign);
    }

    mutateGeneChance(gene) {
        var random = Math.random();
        var sign = Math.random() < 0.5 ? 1 : -1;
        if(random < 0.4) gene = gene * (1 + (0.5 - random) * sign);

        return gene;
    }
}