'use strict'

// ================================================================================
// * Rectangle2D <SDUDOC Renderer>
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
// * Rectangle2D
// --------------------------------------------------------------------------------
function Rectangle2D(){
  this.initialize.apply(this, arguments);
}
// --------------------------------------------------------------------------------
// * Property
// --------------------------------------------------------------------------------
Rectangle2D.prototype._x = 0;
Rectangle2D.prototype._y = 0;
Rectangle2D.prototype._width = 0;
Rectangle2D.prototype._height = 0;
// --------------------------------------------------------------------------------
// * Initialize
// --------------------------------------------------------------------------------
Rectangle2D.prototype.initialize = function(x, y , width, height){
  this._x = x;
  this._y = y;
  this._width = width;
  this._height = height;
};
// --------------------------------------------------------------------------------
// * Getter & Setter
// --------------------------------------------------------------------------------
Object.defineProperty(Rectangle2D.prototype, 'x', {
  get: function() { return this._x; },
  set: function(value) { this._x = value; },
  configurable: true
});
Object.defineProperty(Rectangle2D.prototype, 'y', {
  get: function() { return this._y; },
  set: function(value) { this._y = value; },
  configurable: true
});
Object.defineProperty(Rectangle2D.prototype, 'width', {
  get: function() { return this._width; },
  set: function(value) { this._width = value; },
  configurable: true
});
Object.defineProperty(Rectangle2D.prototype, 'height', {
  get: function() { return this._height; },
  set: function(value) { this._height = value; },
  configurable: true
});
// ================================================================================

// ================================================================================
// * Module exports
// --------------------------------------------------------------------------------
/**
 * Module exports.
 * @public
 */
// --------------------------------------------------------------------------------
module.exports = Rectangle2D;
// ================================================================================
