class Brain {
    constructor(input, hidden, output) {
        // If hidden & output are undefined then it will be DNA passed in.
        if(hidden === undefined && output === undefined) {
            var dna = input;
            this.network = synaptic.Network.fromJSON(dna.brainData);
        }
        else {
            this.network = new Network(input, hidden, output);

            var json = this.network.toJSON();
            for(var i = 0; i < json.connections.length; i++) {
                json.connections[i].weight = (Math.random() * 2) - 1;
            }

            for(var i = 0; i < json.neurons.length; i++) {
                json.neurons[i].bias = Math.random();
            }

            this.network = synaptic.Network.fromJSON(json);
        }
    }

    process(inputs) {
        return this.network.activate(Object.values(inputs));
    }
}