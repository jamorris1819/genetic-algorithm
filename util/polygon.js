/*global Vector,alert*/
var Polygon = (function () {
    function Polygon(pPoints, pFStyle, pSStyle, smooth) {
        this.setPoints(pPoints);
        this.setFillStyle(pFStyle);
        this.setStrokeStyle(pSStyle);
        if (smooth === 'undefined') {
            smooth = false;
        }
        this.mSmooth = smooth;
    }

    Polygon.prototype.setPoints = function (pPoints) {
        var centeredPoints, i, centerPoint;
        centeredPoints = pPoints;

        centerPoint = new Vector(0, 0);
        // Find the centre of all the points.

        for (i = 0; i < centeredPoints.length; i += 1) {
            centerPoint = centerPoint.add(centeredPoints[i]);
        }

        centerPoint = centerPoint.divide(centeredPoints.length);

        // We want the centre to be 0, 0. So we will adjust all points
        // in order to make this so.

        for (i = 0; i < centeredPoints.length; i += 1) {
            centeredPoints[i] = centeredPoints[i].subtract(centerPoint);
        }

        this.mPoints = pPoints;
    };

    Polygon.prototype.getPoints = function () {
        return this.mPoints;
    };

    Polygon.prototype.setStrokeStyle = function (pStyle) {
        this.mStrokeStyle = pStyle;
    };

    Polygon.prototype.getStrokeStyle = function () {
        return this.mStrokeStyle;
    };

    Polygon.prototype.setFillStyle = function (pStyle) {
        this.mFillStyle = pStyle;
    };

    Polygon.prototype.getFillStyle = function () {
        return this.mFillStyle;
    };

    Polygon.prototype.draw = function (pContext) {
        var i, middlePoint;
        pContext.beginPath();
        pContext.lineWidth = 5;
        pContext.moveTo(this.getPoints()[0].getX(), this.getPoints()[0].getY());

        if (this.mSmooth) {
            for (i = 1; i < this.getPoints().length - 2; i += 1) {
                middlePoint = (this.getPoints()[i].add(this.getPoints()[i + 1]))
                    .divide(2);
                pContext.quadraticCurveTo(this.getPoints()[i].getX(),
                    this.getPoints()[i].getY(),
                    middlePoint.getX(), middlePoint.getY());
            }
            pContext.quadraticCurveTo(this.getPoints()[i].getX(),
                this.getPoints()[i].getY(), this.getPoints()[i + 1].getX(),
                this.getPoints()[i + 1].getY());
            pContext.quadraticCurveTo(this.getPoints()[i + 1].getX(),
                this.getPoints()[i + 1].getY(), this.getPoints()[0].getX(),
                this.getPoints()[0].getY());
        } else {
            for (i = 1; i < this.getPoints().length; i += 1) {
                pContext.lineTo(this.getPoints()[i].getX(), this.getPoints()[i].getY());
            }
            pContext.lineTo(this.getPoints()[0].getX(), this.getPoints()[0].getY());
        }

        if(this.getFillStyle() === 0 && this.getStrokeStyle() === 0) {
            pContext.fill()
        }
        else if (this.getFillStyle() !== 0) {
            pContext.fillStyle = this.getFillStyle();
            pContext.fill();
        }
        else if (this.getStrokeStyle() !== 0) {
            pContext.strokeStyle = this.getStrokeStyle();
            pContext.stroke();
        }
    };

    return Polygon;
}());