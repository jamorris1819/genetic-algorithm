/*global alert*/
var Vector = (function () {
    function Vector(pX, pY, pZ) {
        this.setX(pX);
        this.setY(pY);
        !pZ ? 0 :this.setZ(pZ);
    }

    Vector.prototype.getX = function () {
        return this.mX;
    };
    Vector.prototype.setX = function (pX) {
        this.mX = pX;
    };

    Vector.prototype.getY = function () {
        return this.mY;
    };
    
    Vector.prototype.setY = function (pY) {
        this.mY = pY;
    };

    Vector.prototype.getZ = function () {
        return !!this.mZ ? this.mZ : 0;
    };
    Vector.prototype.setZ = function (pZ) {
        this.mZ = pZ;
    };

    Vector.prototype.add = function (pVector) {
        var tempVector = new Vector(0, 0, 0);
        tempVector.setX(this.getX() + pVector.getX());
        tempVector.setY(this.getY() + pVector.getY());
        tempVector.setZ(this.getZ() + pVector.getZ());
        return tempVector;
    };

    Vector.prototype.subtract = function (pVector) {
        var tempVector = new Vector(0, 0, 0);
        tempVector.setX(this.getX() - pVector.getX());
        tempVector.setY(this.getY() - pVector.getY());
        tempVector.setZ(this.getZ() - pVector.getZ());
        return tempVector;
    };

    Vector.prototype.multiply = function (scalar) {
        var tempVector = new Vector(0, 0, 0);
        tempVector.setX(this.getX() * scalar);
        tempVector.setY(this.getY() * scalar);
        tempVector.setZ(this.getZ() * scalar);
        return tempVector;
    };

    Vector.prototype.divide = function (scalar) {
        var tempVector = new Vector(0, 0, 0);
        tempVector.setX(this.getX() / scalar);
        tempVector.setY(this.getY() / scalar);
        tempVector.setZ(this.getZ() / scalar);
        return tempVector;
    };

    Vector.prototype.magnitude = function () {
        return Math.sqrt(Math.pow(this.getX(), 2) + Math.pow(this.getY(), 2));
    };

    Vector.prototype.normalise = function () {
        return this.divide(this.magnitude());
    };

    Vector.prototype.limitTo = function (scalar) {
        return (this.magnitude() > scalar) ? this.normalise().multiply(scalar) : this;
    };

    Vector.prototype.dotProduct = function (pVector) {
        return this.getX() * pVector.getX() + this.getY() * pVector.getY();
    };

    Vector.prototype.interpolate = function (pVector, scalar) {
        var newVector, dir;
        newVector = this;
        dir = pVector.subtract(newVector);
        newVector = newVector.add(dir.multiply(scalar));
        return newVector;
    };

    Vector.prototype.rotate = function (scalar) {
        return new Vector(this.getX() * Math.cos(scalar) - this.getY() * Math.sin(scalar),
            this.getX() * Math.sin(scalar) + this.getY() * Math.cos(scalar));
    };

    Vector.prototype.angleBetween = function (pVector) {
        var cosineResult = (this.getX() * pVector.getX()
            + this.getY() * pVector.getY()
            + this.getZ() * pVector.getZ()) / this.magnitude() * pVector.magnitude();
        return Math.acos(cosineResult);
    };

    Vector.prototype.toString = function () {
        return this.getX() + ", " + this.getY() + ", " + this.getZ();
    };

    Vector.prototype.getElement = function (i) {
        if (i === 0) {
            return this.getX();
        }

        if (i === 1) {
            return this.getY();
        }

        if (i === 2) {
            return this.getZ();
        }

        return null;
    };

    return Vector;
}());