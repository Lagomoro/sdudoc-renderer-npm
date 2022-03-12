'use strict'

// ================================================================================
// * Renderer <SDUDOC Renderer>
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
const Element        = require('./layer/Element');
const ElementFactory = require('./layer/ElementFactory');
const ElementPool    = require('./layer/ElementPool');
const Action         = require('./repository/Action');
const Repository     = require('./repository/Repository');
// ================================================================================

// ================================================================================
// * Renderer
// --------------------------------------------------------------------------------
function Renderer(){
    this.initialize.apply(this, arguments);
}
// --------------------------------------------------------------------------------
// * Constant
// --------------------------------------------------------------------------------
Renderer.Element        = Element;
Renderer.ElementFactory = ElementFactory;
Renderer.Action         = Action;
// --------------------------------------------------------------------------------
// * Property
// --------------------------------------------------------------------------------
Renderer.prototype._header = {};
Renderer.prototype._element_pool = null;
// --------------------------------------------------------------------------------
Renderer.prototype._repository = null;
// --------------------------------------------------------------------------------
// * Getter & Setter
// --------------------------------------------------------------------------------
Object.defineProperty(Renderer.prototype, 'header', {
    get: function() { return this._header; },
    set: function(value) { this._header = value; },
    configurable: true
});
Object.defineProperty(Renderer.prototype, 'element_pool', {
    get: function() { return this._element_pool; },
    set: function(value) { this._element_pool = value; },
    configurable: true
});
Object.defineProperty(Renderer.prototype, 'repository', {
    get: function() { return this._repository; },
    set: function(value) { this._repository = value; },
    configurable: true
});
// --------------------------------------------------------------------------------
// * Initialize
// --------------------------------------------------------------------------------
Renderer.prototype.initialize = function(){

};
Renderer.prototype.clear = function(){

};
// --------------------------------------------------------------------------------
// * Version control
// --------------------------------------------------------------------------------
/**
 * Write buffer to Renderer.
 */
Renderer.prototype.commit = function(username){
    this._repository.commit(username);
};
// --------------------------------------------------------------------------------
/**
 * Add version control info from package.
 */
Renderer.prototype.pull = function(json_package){
    let action = this._repository.pull(json_package);
    if(action !== null){
        this._element_pool.applyAction(action);
    }
};
/**
 * Pak version control info after HEAD to package.
 */
Renderer.prototype.push = function(head){
    return this._repository.push(head);
};
// --------------------------------------------------------------------------------
// * Save & Load Version control
// --------------------------------------------------------------------------------
/**
 * Load version control info from json.
 */
Renderer.prototype.apply = function(json_object){
    this._repository.apply(json_object.Repository);
};
/**
 * Save version control info to json.
 */
Renderer.prototype.freeze = function(){
    let json_object = {};
    json_object.Repository = this._repository.freeze();
    return json_object;
};
// --------------------------------------------------------------------------------
// * Function
// --------------------------------------------------------------------------------
/**
 * Can undo.
 */
Renderer.prototype.canUndo = function(){
    return this._repository.canUndo();
}
/**
 * Can redo.
 */
Renderer.prototype.canRedo = function(){
    return this._repository.canRedo();
}
// --------------------------------------------------------------------------------
/**
 * Apply action.
 */
Renderer.prototype.applyAction = function(action){
    this._repository.applyAction(action);
    this._element_pool.applyAction(action);
};
// --------------------------------------------------------------------------------
/**
 * Undo.
 */
Renderer.prototype.undo = function(){
    let action = this._repository.undo();
    if (action !== null){
        this._element_pool.revertAction(action);
    }
};
/**
 * Redo.
 */
Renderer.prototype.redo = function(){
    let action = this._repository.redo();
    if (action !== null){
        this._element_pool.applyAction(action);
    }
};
// --------------------------------------------------------------------------------
// * Save, Load & Export
// --------------------------------------------------------------------------------
/**
 * Load Renderer elements from json.
 */
Renderer.prototype.loadJson = function(json_object){
    this._header = json_object.Header;
    this._element_pool.loadJson(json_object.Elements);
};
/**
 * Save Renderer elements to json.
 */
Renderer.prototype.saveJson = function(){
    let json_object = {};
    json_object.Header = this._header;
    json_object.Elements = this._element_pool.saveJson();
    return json_object;
};
/**
 * Export Renderer elements to json.
 */
Renderer.prototype.exportJson = function(){
    let json_object = {};
    json_object.Header = this._header;
    json_object.Elements = this._element_pool.exportJson();
    return json_object;
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
module.exports = Renderer
// ================================================================================
