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
// * Constant
// --------------------------------------------------------------------------------
LayerFactory.SAPARATOR = '_';
// --------------------------------------------------------------------------------
// * Property
// --------------------------------------------------------------------------------
LayerFactory._interpreter = {};
// --------------------------------------------------------------------------------
// * Function
// --------------------------------------------------------------------------------
LayerFactory.addInterpreter = function(element){
    this._interpreter[element.TAG] = element;
};
// --------------------------------------------------------------------------------
// * New Element
// --------------------------------------------------------------------------------
LayerFactory.newElement = function(username, tag){
    return this._interpreter[tag].newElement(arguments);
};
// --------------------------------------------------------------------------------
// * Load Element
// --------------------------------------------------------------------------------
LayerFactory.loadElement = function(json_object){
    let element = this._interpreter[json_object.tag].newElement();
    element.loadJson(json_object);
    return element;
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