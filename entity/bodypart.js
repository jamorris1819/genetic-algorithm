class BodyPart {
    constructor(seed, size) {
        this.seed = seed;
        this.size = size;
        this.points = this.generatePoints();
        this.polygon = new Polygon(this.points, 0, 0, false);
    }

    generatePoints() {
        // Number of segments + data.
        var segmentCount = 16;
        var segmentSize = Math.PI / segmentCount;
        var points = [];
        noise.seed(0);

        // Generate extrusion length.
        var extrusions = [];
        for(var i = 0; i <= Math.PI; i += segmentSize) {
            extrusions.push(this.generateNoise(i / Math.PI));
        }
        // Normalise extrusions to the range 0 - 1.
        extrusions = extrusions.map(x => Math.abs(x));
        var longestExtrusion = extrusions.sort((a, b) => { return b - a; })[0];
        extrusions = extrusions.map(x => x / longestExtrusion);

        for(var i = 0; i < segmentCount; i += 1) {
            var extrusion = extrusions[i];
            var point = new Vector(-Math.cos(i * segmentSize), Math.sin(i * segmentSize));
            point = point.multiply(extrusion * this.size);
            points.push(point);
        }
        
        var points2 = points.slice(0);
        for(var i = 0; i < points2.length; i++) {
            points2[i] = new Vector(points2[i].getX(), points2[i].getY() * -1);
        }
        //points2.pop();
        points2.reverse();

        points = points.concat(points2);

        return points.map(x => new Vector(x.getX() * 2, x.getY()));
    }

    draw(context, position, rotation) {
        context.save();
        context.translate(position.getX(), position.getY());
        this.polygon.draw(context, rotation);
        context.restore();
    }

    generateNoise(x) {
        var myNoise = new tumult.Perlin1(this.seed);
        return myNoise.gen(x);
    }
}