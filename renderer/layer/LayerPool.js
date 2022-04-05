'use strict'

// ================================================================================
// * LayerPool <SDUDOC Renderer>
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
const LayerFactory = require("./LayerFactory");
// ================================================================================

// ================================================================================
// * LayerPool
// --------------------------------------------------------------------------------
function LayerPool(){
    this.initialize.apply(this, arguments);
}
// --------------------------------------------------------------------------------
// * Property
// --------------------------------------------------------------------------------
LayerPool.prototype._layers = [];
// --------------------------------------------------------------------------------
// * Getter & Setter
// --------------------------------------------------------------------------------
Object.defineProperty(LayerPool.prototype, 'layers', {
    get: function() { return this._layers; },
    set: function(value) { this._layers = value; },
    configurable: true
});
// --------------------------------------------------------------------------------
// * Initialize
// --------------------------------------------------------------------------------
LayerPool.prototype.initialize = function(){
    this._setupZList();
};
// --------------------------------------------------------------------------------
LayerPool.prototype.clear = function(){
    for(let i = 0; i < this._layers.length; i++){
        this._layers[i].clear();
    }
};
// --------------------------------------------------------------------------------
// * Function
// --------------------------------------------------------------------------------
LayerPool.prototype._setupZList = function() {
    let temp = LayerFactory.createLayers();
    this._layers = [];
    for(let index = 0; index < temp.length; index++){
        let insert = false;
        for(let i = 0; i < this._layers.length; i++){
            if(LayerFactory._layers[index].z_index < this._layers[i].z_index){
                this._layers.splice(i, 0, temp[index]);
                insert = true;
                break;
            } else if (i < this._layers.length - 1 && temp[index].z_index < this._layers[i + 1].z_index){
                this._layers.splice(i + 1, 0, temp[index]);
                insert = true;
                break;
            }
        }
        if(insert === false){
            this._layers.push(temp[index]);
        }
    }
};
// --------------------------------------------------------------------------------
LayerPool.prototype.renderBottomLayers = function(ctx) {
    for(let i = 0; i < this._layers.length; i++){
        if(this._layers[i].z_index < 0){
            this._layers[i].render(ctx);
        }
    }
};
LayerPool.prototype.renderTopLayers = function(ctx) {
    for(let i = 0; i < this._layers.length; i++){
        if(this._layers[i].z_index > 0){
            this._layers[i].render(ctx);
        }
    }
};
// --------------------------------------------------------------------------------
LayerPool.prototype.update = function(origin, viewport, scale, document){
    for(let i = 0; i < this._layers.length; i++){
        this._layers[i].update(origin, viewport, scale, document);
    }
};
// --------------------------------------------------------------------------------
LayerPool.prototype.refresh = function(mousePoint){

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
module.exports = LayerPool;
// ================================================================================
