function componentToHex(c) {
    var hex = c.toString(16);
    return hex.length == 1 ? "0" + hex : hex;
}

function rgbToHex(r, g, b) {
    return "#" + componentToHex(r) + componentToHex(g) + componentToHex(b);
}

function hexToRgb(hex) {
  var result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
  return result ? {
    r: parseInt(result[1], 16),
    g: parseInt(result[2], 16),
    b: parseInt(result[3], 16)
  } : null;
}

function colourDarken(colour) {
    colour.r /= 2;
    colour.g /= 2;
    colour.b /= 2;

    colour.r = Math.floor(colour.r);
    colour.g = Math.floor(colour.g);
    colour.b = Math.floor(colour.b);

    return colour;
}

class Colour {
    constructor(r, g, b) {
        if(typeof g === "undefined") {
            var colour = hexToRgb(r);
            this.r = colour.r;
            this.g = colour.g;
            this.b = colour.b;
        }
        else {
            this.r = r;
            this.g = g;
            this.b = b;
        }
    }

    toStyle() {
        return rgbToHex(this.r, this.g, this.b);
    }
}