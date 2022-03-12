'use strict'

// ================================================================================
// * Point2D <SDUDOC Renderer>
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
// ================================================================================

// ================================================================================
// * Point2D
// --------------------------------------------------------------------------------
function Point2D(){
  this.initialize.apply(this, arguments);
}
// --------------------------------------------------------------------------------
// * Property
// --------------------------------------------------------------------------------
Point2D.prototype._x = 0;
Point2D.prototype._y = 0;
// --------------------------------------------------------------------------------
// * Initialize
// --------------------------------------------------------------------------------
Point2D.prototype.initialize = function(x, y){
  this._x = x;
  this._y = y;
};
// --------------------------------------------------------------------------------
// * Getter & Setter
// --------------------------------------------------------------------------------
Object.defineProperty(Point2D.prototype, 'x', {
  get: function() { return this._x; },
  set: function(value) { this._x = value; },
  configurable: true
});
Object.defineProperty(Point2D.prototype, 'y', {
  get: function() { return this._y; },
  set: function(value) { this._y = value; },
  configurable: true
});
// --------------------------------------------------------------------------------
// * Functions
// --------------------------------------------------------------------------------
Point2D.prototype.getCopy = function(){
  return new Point2D(this._x, this._y);
};
// --------------------------------------------------------------------------------
Point2D.prototype.moveTo = function(x, y){
  this._x = x; this._y = y;
};
Point2D.prototype.moveBy = function(x, y){
  this._x += x; this._y += y;
};
// --------------------------------------------------------------------------------
Point2D.prototype.distance = function(point){
  let distance2D = this.minus(point);
  return Math.sqrt(Math.pow(distance2D.x, 2) + Math.pow(distance2D.y, 2));
};
// --------------------------------------------------------------------------------
Point2D.prototype.add = function(point){
  return new Point2D(this.x + point.x, this.y + point.y);
};
Point2D.prototype.minus = function(point){
  return new Point2D(this.x - point.x, this.y - point.y);
};
Point2D.prototype.multiply = function(num){
  return new Point2D(this.x * num, this.y * num);
};
Point2D.prototype.division = function(num){
  return new Point2D(this.x / num, this.y / num);
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
module.exports = Point2D;
// ================================================================================