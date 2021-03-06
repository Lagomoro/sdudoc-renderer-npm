'use strict'

// ================================================================================
// * LayerFactory <SDUDOC Renderer>
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
// * LayerFactory
// --------------------------------------------------------------------------------
function LayerFactory(){
    throw new Error('This is a static class');
}
// --------------------------------------------------------------------------------
// * Property
// --------------------------------------------------------------------------------
LayerFactory._layers = {};
// --------------------------------------------------------------------------------
// * Function
// --------------------------------------------------------------------------------
LayerFactory.addLayer = function(layer){
    this._layers[layer.TAG] = layer;
};
// --------------------------------------------------------------------------------
// * New Element
// --------------------------------------------------------------------------------
LayerFactory.createLayers = function(){
    let layers = [];
    for(let key in this._layers){
        layers.push(new this._layers[key]);
    }
    return layers;
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
module.exports = LayerFactory;
// ================================================================================