class Brain {
    constructor(input, hidden, output) {
        // If hidden & output are undefined then it will be DNA passed in.
        if(hidden === undefined && output === undefined) {
            var dna = input;
            this.network = synaptic.Network.fromJSON(dna);
        }
        else {
            this.network = new Network(input, hidden, output);
        }
    }

    process(inputs) {
        return this.network.activate(inputs);
    }
}