'use strict'

// ================================================================================
// * Grid2D <SDUDOC Renderer>
// --------------------------------------------------------------------------------
//   Designer: Lagomoro <Yongrui Wang>
//   License: MIT
// ================================================================================

// ================================================================================
// * Module dependencies
// --------------------------------------------------------------------------------
/**
 * Module dependencies.
 * @private
 */
// --------------------------------------------------------------------------------
const Point2D     = require("../core/Point2D");
const Line2D      = require('../core/Line2D');
const Polygon2D   = require('../core/Polygon2D');
const Rectangle2D = require("../core/Rectangle2D");
// ================================================================================

// ================================================================================
// * Grid2D
// --------------------------------------------------------------------------------
function Grid2D(){
    this.initialize.apply(this, arguments);
}
// --------------------------------------------------------------------------------
// * Constant
// --------------------------------------------------------------------------------
Grid2D.MIN_SCALE = 0.025;
Grid2D.MAX_SCALE = 5;
// --------------------------------------------------------------------------------
// * Property
// --------------------------------------------------------------------------------
Grid2D.prototype._origin = null;
Grid2D.prototype._scale = null;
Grid2D.prototype._viewport = null;
// --------------------------------------------------------------------------------
// * Getter & Setter
// --------------------------------------------------------------------------------
Object.defineProperty(Grid2D.prototype, 'origin', {
    get: function() { return this._origin; },
    set: function(value) { this._origin = value; },
    configurable: true
});
Object.defineProperty(Grid2D.prototype, 'scale', {
    get: function() { return this._scale; },
    set: function(value) { this._scale = value; },
    configurable: true
});
Object.defineProperty(Grid2D.prototype, 'viewport', {
    get: function() { return this._viewport; },
    set: function(value) { this._viewport = value; },
    configurable: true
});
// --------------------------------------------------------------------------------
// * Initialize
// --------------------------------------------------------------------------------
Grid2D.prototype.initialize = function(){
    this._origin = new Point2D(0 ,0);
    this._scale = 0;
    this._viewport = null;
};
Grid2D.prototype.clear = function(){
    this._origin.moveTo(0, 0);
    this._scale = 0;
    this._viewport = null;
};
// --------------------------------------------------------------------------------
// * Functions
// --------------------------------------------------------------------------------
Grid2D.prototype.setViewport = function(width, height){
    this._viewport = new Rectangle2D(0, 0, width, height);
};
// --------------------------------------------------------------------------------
// * Origin
// --------------------------------------------------------------------------------
Grid2D.setOrigin = function(x, y){
    this._origin.moveTo(x, y);
};
Grid2D.moveOrigin = function(x, y){
    this._origin.moveBy(x, y);
};
// --------------------------------------------------------------------------------
// * Scale
// --------------------------------------------------------------------------------
Grid2D.setScale = function(scale){
    this._scale = scale;
};
// --------------------------------------------------------------------------------
Grid2D.addScale = function(scale){
    this.setScale(Math.max(Grid2D.MIN_SCALE, Math.min(this._scale + scale, Grid2D.MAX_SCALE)));
};
Grid2D.multiScale = function(scale){
    this.setScale(Math.max(Grid2D.MIN_SCALE, Math.min(this._scale * scale, Grid2D.MAX_SCALE)));
};
// --------------------------------------------------------------------------------
// * Point2D Transition
// --------------------------------------------------------------------------------
Grid2D.getPoint2D_ViewportToSource = function(point){
    return point.minus(this._origin).division(this._scale);
};
Grid2D.getPoint2D_SourceToViewport = function(point){
    return point.multiply(this._scale).add(this._origin);
};
// --------------------------------------------------------------------------------
Grid2D.getDistance2D_ViewportToSource = function(distance){
    return distance.division(this._scale);
};
Grid2D.getDistance2D_SourceToViewport = function(distance){
    return distance.multiply(this._scale);
};
// --------------------------------------------------------------------------------
// * Line2D Transition
// --------------------------------------------------------------------------------
Grid2D.getLine2D_ViewportToSource = function(line){
    return new Line2D(this.getPoint2D_ViewportToSource(line.start), this.getPoint2D_ViewportToSource(line.end));
};
Grid2D.getLine2D_SourceToViewport = function(line){
    return new Line2D(this.getPoint2D_SourceToViewport(line.start), this.getPoint2D_SourceToViewport(line.end));
};
// --------------------------------------------------------------------------------
// * Polygon2D Transition
// --------------------------------------------------------------------------------
Grid2D.getPolygon2D_ViewportToSource = function(polygon){
    let points = [];
    for(let i = 0; i < polygon.points.length; i++){
        points.push(this.getPoint2D_ViewportToSource(polygon.points[i]));
    }
    return new Polygon2D(points);
};
Grid2D.getPolygon2D_SourceToViewport = function(polygon){
    let points = [];
    for(let i = 0; i < polygon.points.length; i++){
        points.push(this.getPoint2D_SourceToViewport(polygon.points[i]));
    }
    return new Polygon2D(points);
};
// ================================================================================

// ================================================================================
// * Module exports
// --------------------------------------------------------------------------------
/**
 * Module exports.
 * @public
 */
// --------------------------------------------------------------------------------
module.exports = Grid2D;
// ================================================================================
