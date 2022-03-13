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
LayerPool.prototype.drawBottomLayers = function(ctx) {
    for(let i = 0; i < this._layers.length; i++){
        if(this._layers[i].z_index < 0){

        }
    }
};
LayerPool.prototype.drawTopLayers = function(ctx) {
    for(let i = 0; i < this._layers.length; i++){
        if(this._layers[i].z_index > 0){

        }
    }
};
// --------------------------------------------------------------------------------
LayerPool.prototype.update = function(width, height){

};
// --------------------------------------------------------------------------------
LayerPool.prototype.refresh = function(width, height){

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

// ================================================================================
// * RenderManager <SDUDOC Engine>
// --------------------------------------------------------------------------------
//   Designer: Lagomoro <Yongrui Wang>
//   From: SDU <Shandong University>
//   License: MIT license
// --------------------------------------------------------------------------------
//   Latest update:
//   2021/03/15 - Version 1.0.0
//     - Engine core
// ================================================================================

// ================================================================================
// * RenderManager
// --------------------------------------------------------------------------------
function RenderManager() {
    throw new Error('This is a static class');
}
// --------------------------------------------------------------------------------
// * Property
// --------------------------------------------------------------------------------
RenderManager._renderers = {};
RenderManager._z_list = [];
// --------------------------------------------------------------------------------
// * Initialize
// --------------------------------------------------------------------------------
RenderManager.initialize = function() {
    this.clear();
    this._setupZList();
};
RenderManager.clear = function() {
    this._z_list = [];
};

// --------------------------------------------------------------------------------
// * Functions
// --------------------------------------------------------------------------------
RenderManager.addRenderer = function(renderer){
    this._renderers[renderer.id] = renderer;
};
RenderManager.removeRenderer = function(id){
    this._renderers.remove(id);
    for(let i = 0; i < this._z_list.length; i++){
        if(this._z_list[i] === id){
            this._z_list.splice(i, 1);
        }
    }
};
// --------------------------------------------------------------------------------
RenderManager.setVisible = function(id, value){
    this._renderers[id].setVisible(value);
};
// --------------------------------------------------------------------------------
RenderManager.getVisibleList = function(){
    let output = [];
    for(let key in this._renderers){
        output.push({
            id: this._renderers[key].id,
            name: this._renderers[key].name,
            visible: this._renderers[key].visible
        });
    }
    return output;
};
// --------------------------------------------------------------------------------
RenderManager.canToolManagerCurrentPluginCall = function(id){
    return id.startsWith('_') || id.startsWith(ToolManager.getCurrentPluginId())
        || (id.startsWith('!') && !id.startsWith('!' + ToolManager.getCurrentPluginId()))
}
RenderManager.callRenderer = function(ctx){
    for(let i = 0; i < this._z_list.length; i++){
        if(this._renderers[this._z_list[i]].visible &&
            this.canToolManagerCurrentPluginCall(this._renderers[this._z_list[i]].id)){
            this._renderers[this._z_list[i]].render.call(this._renderers[this._z_list[i]], ctx);
        }
    }
};
// ================================================================================
// ================================================================================
// * RenderManager <SDUDOC Engine>
// --------------------------------------------------------------------------------
//   Designer: Lagomoro <Yongrui Wang>
//   From: SDU <Shandong University>
//   License: MIT license
// --------------------------------------------------------------------------------
//   Latest update:
//   2021/03/15 - Version 1.0.0
//     - Engine core
// ================================================================================

// ================================================================================
// * RenderManager
// --------------------------------------------------------------------------------
function RenderManager() {
    throw new Error('This is a static class');
}
// --------------------------------------------------------------------------------
// * Property
// --------------------------------------------------------------------------------
RenderManager._renderers = {};
RenderManager._z_list = [];
// --------------------------------------------------------------------------------
// * Initialize
// --------------------------------------------------------------------------------
RenderManager.initialize = function() {
    this.clear();
    this._setupZList();
};
RenderManager.clear = function() {
    this._z_list = [];
};
RenderManager._setupZList = function() {
    let temp = [];
    for(let key in this._renderers){
        temp.push({id: this._renderers[key].id, z_index: this._renderers[key].z_index});
    }
    let min_id = 0;
    while(temp.length > 0){
        min_id = 0;
        for(let i = 0;i < temp.length; i++){
            if(temp[i].z_index < temp[min_id].z_index){
                min_id = i;
            }
        }
        this._z_list.push(temp.splice(min_id, 1)[0].id);
    }
};
// --------------------------------------------------------------------------------
// * Functions
// --------------------------------------------------------------------------------
RenderManager.addRenderer = function(renderer){
    this._renderers[renderer.id] = renderer;
};
RenderManager.removeRenderer = function(id){
    this._renderers.remove(id);
    for(let i = 0; i < this._z_list.length; i++){
        if(this._z_list[i] === id){
            this._z_list.splice(i, 1);
        }
    }
};
// --------------------------------------------------------------------------------
RenderManager.setVisible = function(id, value){
    this._renderers[id].setVisible(value);
};
// --------------------------------------------------------------------------------
RenderManager.getVisibleList = function(){
    let output = [];
    for(let key in this._renderers){
        output.push({
            id: this._renderers[key].id,
            name: this._renderers[key].name,
            visible: this._renderers[key].visible
        });
    }
    return output;
};
// --------------------------------------------------------------------------------
RenderManager.canToolManagerCurrentPluginCall = function(id){
    return id.startsWith('_') || id.startsWith(ToolManager.getCurrentPluginId())
        || (id.startsWith('!') && !id.startsWith('!' + ToolManager.getCurrentPluginId()))
}
RenderManager.callRenderer = function(ctx){
    for(let i = 0; i < this._z_list.length; i++){
        if(this._renderers[this._z_list[i]].visible &&
            this.canToolManagerCurrentPluginCall(this._renderers[this._z_list[i]].id)){
            this._renderers[this._z_list[i]].render.call(this._renderers[this._z_list[i]], ctx);
        }
    }
};
// ================================================================================
