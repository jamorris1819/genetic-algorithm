class Network extends synaptic.Network {
    constructor(input, hidden, output) {
        // Create the layers.
        super();
        var inputLayer = new synaptic.Layer(input);
        inputLayer.set({
            squash: synaptic.Neuron.squash.RELU
        });
        var hiddenLayers = [];
        for(var i = 0; i < hidden.length; i++) {
            hiddenLayers[i] = new synaptic.Layer(hidden[i]);
            hiddenLayers[i].set({
                squash: synaptic.Neuron.squash.RELU
            });
        }
        var outputLayer = new synaptic.Layer(output);

        // Connect the layers together.
        inputLayer.project(hiddenLayers.length > 0 ? hiddenLayers[0] : outputLayer);

        if(hiddenLayers.length === 1) hiddenLayers[0].project(outputLayer);
        for(var i = 0; i < hiddenLayers.length - 1; i++) {
            hiddenLayers[i].project(hiddenLayers[i + 1]);
        }
        if(hiddenLayers.length > 1) hiddenLayers[hiddenLayers.length - 1].project(outputLayer);
        // Set the layers.
        this.set({
            input: inputLayer,
            hidden: hiddenLayers,
            output: outputLayer
        });

        
    }
}