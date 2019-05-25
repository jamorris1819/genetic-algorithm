/*global Vector*/
var Arc = (function () {
    function Arc(pRadius, pAngleStart, pAngleEnd, pFillStyle, pStrokeStyle) {
        this.setRadius(pRadius);
        this.setAngleStart(pAngleStart);
        this.setAngleEnd(pAngleEnd);
        this.setFillStyle(pFillStyle);
        this.setStrokeStyle(pStrokeStyle);
    }

    Arc.prototype.setRadius = function (pRadius) {
        this.mRadius = pRadius;
    };

    Arc.prototype.getRadius = function () {
        return this.mRadius;
    };

    Arc.prototype.setAngleStart = function (pAngleStart) {
        this.mAngleStart = pAngleStart;
    };

    Arc.prototype.getAngleStart = function () {
        return this.mAngleStart;
    };

    Arc.prototype.setAngleEnd = function (pAngleEnd) {
        this.mAngleEnd = pAngleEnd;
    };

    Arc.prototype.getAngleEnd = function () {
        return this.mAngleEnd;
    };

    Arc.prototype.setStrokeStyle = function (pStyle) {
        this.mStrokeStyle = pStyle;
    };

    Arc.prototype.getStrokeStyle = function () {
        return this.mStrokeStyle;
    };

    Arc.prototype.setFillStyle = function (pStyle) {
        this.mFillStyle = pStyle;
    };

    Arc.prototype.getFillStyle = function () {
        return this.mFillStyle;
    };

    Arc.prototype.draw = function (pContext) {
        pContext.beginPath();
        pContext.arc(0, 0, this.getRadius(), this.getAngleStart(),
            this.getAngleEnd(), false);

        if (this.getFillStyle() !== 0) {
            pContext.fillStyle = this.getFillStyle();
            pContext.fill();
        }

        if (this.getStrokeStyle() !== 0) {
            pContext.strokeStyle = this.getStrokeStyle();
            pContext.stroke();
        }
    };

    return Arc;
}());