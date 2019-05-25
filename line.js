/*global Vector*/
var Line = (function () {
    function Line(pStart, pEnd, pStyle, pWidth) {
        this.setStartPoint(pStart);
        this.setEndPoint(pEnd);
        this.setStrokeStyle(pStyle);
        this.setWidth(pWidth);
    }

    Line.prototype.setStartPoint = function (pStart) {
        this.mStart = pStart;
    };

    Line.prototype.getStartPoint = function () {
        return this.mStart;
    };

    Line.prototype.setEndPoint = function (pEnd) {
        this.mEnd = pEnd;
    };

    Line.prototype.getEndPoint = function () {
        return this.mEnd;
    };

    Line.prototype.setStrokeStyle = function (pStyle) {
        this.mStrokeStyle = pStyle;
    };

    Line.prototype.getStrokeStyle = function () {
        return this.mStrokeStyle;
    };

    Line.prototype.setWidth = function (pWidth) {
        this.mWidth = pWidth;
    };

    Line.prototype.getWidth = function () {
        return this.mWidth;
    };

    Line.prototype.draw = function (pContext) {
        pContext.beginPath();
        pContext.lineWidth = this.getWidth();
        pContext.strokeStyle = this.getStrokeStyle();
        pContext.moveTo(this.getStartPoint().getX(), this.getStartPoint().getY());
        pContext.lineTo(this.getEndPoint().getX(), this.getEndPoint().getY());
        pContext.stroke();
    };

    return Line;
}());