'use strict'

// ================================================================================
// * Layer <SDUDOC Renderer>
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
const Point2D      = require("../core/Point2D");
const Line2D       = require('../core/Line2D');
const Polygon2D    = require('../core/Polygon2D');
const Rectangle2D  = require("../core/Rectangle2D");
const GraphicsUtil = require("../graphics/GraphicsUtil");
// ================================================================================

// ================================================================================
// * Layer
// --------------------------------------------------------------------------------
function Layer(){
    this.initialize.apply(this, arguments);
}
// --------------------------------------------------------------------------------
// * Constant
// --------------------------------------------------------------------------------
Layer.TAG = "Layer";
// --------------------------------------------------------------------------------
// * Property
// --------------------------------------------------------------------------------
Layer.prototype._x = 0;
Layer.prototype._y = 0;
Layer.prototype._origin = new Point2D(0 ,0);
// --------------------------------------------------------------------------------
Layer.prototype._canvas = null;
Layer.prototype._context = null;
Layer.prototype._texture = null;
// --------------------------------------------------------------------------------
// * Getter & Setter
// --------------------------------------------------------------------------------
Object.defineProperty(Layer.prototype, 'x', {
    get: function() { return this._x; },
    set: function(value) { this._x = value; },
    configurable: true
});
Object.defineProperty(Layer.prototype, 'y', {
    get: function() { return this._y; },
    set: function(value) { this._y = value; },
    configurable: true
});
Object.defineProperty(Layer.prototype, 'origin', {
    get: function() { return this._origin; },
    set: function(value) { this._origin = value; },
    configurable: true
});
// --------------------------------------------------------------------------------
Object.defineProperty(Layer.prototype, 'canvas', {
    get: function() { return this._canvas; },
    set: function(value) { this._canvas = value; },
    configurable: true
});
Object.defineProperty(Layer.prototype, 'context', {
    get: function() { return this._context; },
    set: function(value) { this._context = value; },
    configurable: true
});
Object.defineProperty(Layer.prototype, 'texture', {
    get: function() { return this._texture; },
    set: function(value) { this._texture = value; },
    configurable: true
});
// --------------------------------------------------------------------------------
// * Initialize
// --------------------------------------------------------------------------------
Layer.prototype.initialize = function(){
    this._x = 0;
    this._y = 0;
    this._origin = new Point2D(0 ,0);

    this._canvas = document.createElement('canvas');
    this._context = this._canvas.getContext('2d');
    this._texture = PIXI.Texture.from(this._canvas);
};
Layer.prototype.clear = function(){
    this._x = 0;
    this._y = 0;
    this._origin.moveTo(0, 0);

    this._texture.dispose();
    this._context.dispose();
    this._canvas.dispose();

    this._canvas = document.createElement('canvas');
    this._context = this._canvas.getContext('2d');
    this._texture = PIXI.Texture.from(this._canvas);
};
// --------------------------------------------------------------------------------
// * Function
// --------------------------------------------------------------------------------
Layer.prototype.render = function(ctx){
    GraphicsUtil.drawTexture(ctx, this._texture, 0, 0, 0, 0, this._scale);
};
// --------------------------------------------------------------------------------
Layer.prototype.update = function(origin, viewport, scale, document){

};
// --------------------------------------------------------------------------------
Layer.prototype.refresh = function(width, height){

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
module.exports = Layer;
// ================================================================================
