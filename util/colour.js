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