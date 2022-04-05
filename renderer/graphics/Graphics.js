'use strict'

// ================================================================================
// * Graphics <SDUDOC Renderer>
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
const Grid2D      = require("./Grid2D");
const LayerPool = require("../layer/LayerPool");
const GraphicsUtil = require("./GraphicsUtil");
// ================================================================================

// ================================================================================
// * Graphics
// --------------------------------------------------------------------------------
function Graphics(){
    this.initialize.apply(this, arguments);
}
// --------------------------------------------------------------------------------
// * Constant
// --------------------------------------------------------------------------------
Graphics.GRID_UNIT_LENGTH = 12.5;
Graphics.GRID_UNIT_LIMIT = 100;
// --------------------------------------------------------------------------------
Graphics.SCALE_PLATE_WIDTH = 20;
// --------------------------------------------------------------------------------
// * Config
// --------------------------------------------------------------------------------
Graphics.DRAW_GRID = true;
Graphics.DRAW_SCALE_PLATE = true;
// --------------------------------------------------------------------------------
// * Property
// --------------------------------------------------------------------------------
Graphics.prototype._grid = null;
Graphics.prototype._layer_pool = null;
// --------------------------------------------------------------------------------
Graphics.prototype._canvas = null;
Graphics.prototype._context = null;
Graphics.prototype._texture = null;
// --------------------------------------------------------------------------------
// * Getter & Setter
// --------------------------------------------------------------------------------
Object.defineProperty(Graphics.prototype, 'header', {
    get: function() { return this._header; },
    set: function(value) { this._header = value; },
    configurable: true
});
// --------------------------------------------------------------------------------
// * Initialize
// --------------------------------------------------------------------------------
Graphics.prototype.initialize = function(canvas){
    this._grid = new Grid2D();
    this._layer_pool = new LayerPool();

    this._canvas = canvas;
    this._context = this._canvas.getContext('2d');
    this._texture = PIXI.Texture.from(this._canvas);
};
Graphics.prototype.clear = function(){
    this._grid.clear();
    this._layer_pool.clear();

    this._context.clear();
};
// --------------------------------------------------------------------------------
// * Render Frame
// --------------------------------------------------------------------------------
Graphics.prototype.render = function(){
    if (!this._canvas) return;

    this._context.clear();

    this._layer_pool.renderBottomLayers(this._context);
    if (Graphics.DRAW_GRID) this.drawGrid();
    this._layer_pool.renderTopLayers(this._context);
    if (Graphics.DRAW_SCALE_PLATE) this.drawScalePlate();
};
// --------------------------------------------------------------------------------
// * Refresh Frame
// --------------------------------------------------------------------------------
Graphics.prototype.update = function(){
    if (!this._canvas) return;

};
// --------------------------------------------------------------------------------
Graphics.prototype.refresh = function(){
    if (!this._canvas) return;

};
// --------------------------------------------------------------------------------
// * Draw Parts
// --------------------------------------------------------------------------------
Graphics.prototype.drawGrid = function(){
    let scaled_unit = Graphics.GRID_UNIT_LENGTH * this._grid.scale;
    let draw_unit = 0;
    let unit_scale = 1;
    if(scaled_unit < Graphics.GRID_UNIT_LIMIT) {
        for(let i = scaled_unit; i < Graphics.GRID_UNIT_LIMIT; i *= 2){
            draw_unit = i;
            unit_scale *= 2;
        }
    }else{
        for(let i = scaled_unit; i > Graphics.GRID_UNIT_LIMIT / 2; i /= 2){
            draw_unit = i;
            unit_scale /= 2;
        }
    }
    let draw_start_x = this._grid.origin.x / draw_unit;
    let draw_start_y = this._grid.origin.y / draw_unit;
    let draw_origin_x = Math.floor(draw_start_x);
    let draw_origin_y = Math.floor(draw_start_y);

    let sx = 0;
    let sy = 0;
    let cw = this._canvas.width;
    let ch = this._canvas.height;

    for(let i = draw_start_x - draw_origin_x; i <= cw / draw_unit; i ++){
        let alpha = ((Math.floor(i) - draw_origin_x) % 2 === 0 ? 1 : Math.min(1, draw_unit / 10 - 5));
        GraphicsUtil.fillRect(this._context, sx + i * draw_unit - 0.5, sy, 1, ch, 0xd3d3d3, alpha);
    }
    for(let i = draw_start_y - draw_origin_y; i <= ch / draw_unit; i ++){
        let alpha = ((Math.floor(i) - draw_origin_y) % 2 === 0 ? 1 : Math.min(1, draw_unit / 10 - 5));
        GraphicsUtil.fillRect(this._context, sx, sy + i * draw_unit - 0.5, cw, 1, 0xd3d3d3, alpha);
    }
};
Graphics.prototype.drawScalePlate = function(){
    GraphicsUtil.fillRect(this._context, 0, 0, Graphics.SCALE_PLATE_WIDTH, this._canvas.height, 0xf5f5f5, 1);
    GraphicsUtil.fillRect(this._context, 0, 0, this._canvas.width, Graphics.SCALE_PLATE_WIDTH, 0xf5f5f5, 1);
    GraphicsUtil.fillRect(this._context, this._content_rect.x - 1, this._content_rect.y - 1, 1, this._content_rect.height,
        0xd3d3d3, 1);
    GraphicsUtil.fillRect(this._context, this._content_rect.x - 1, this._content_rect.y - 1, this._content_rect.width, 1,
        0xd3d3d3, 1);

    this._temp_context.font = '8px Arial';

    let scaled_unit = this.GRID_UNIT_LENGTH * this._scale;
    let draw_unit = 0;
    let unit_scale = 1;
    if(scaled_unit < this.GRID_UNIT_LIMIT) {
        for(let i = scaled_unit; i < this.GRID_UNIT_LIMIT; i *= 2){
            draw_unit = i;
            unit_scale *= 2;
        }
    }else{
        for(let i = scaled_unit; i > this.GRID_UNIT_LIMIT / 2; i /= 2){
            draw_unit = i;
            unit_scale /= 2;
        }
    }
    let draw_start_x = this._origin.x / draw_unit;
    let draw_start_y = this._origin.y / draw_unit;
    let draw_origin_x = Math.floor(draw_start_x);
    let draw_origin_y = Math.floor(draw_start_y);

    let sx = 0;
    let sy = 0;
    let cw = this._canvas.width;
    let ch = this._canvas.height;

    let cx = this._content_rect.x;
    let cy = this._content_rect.y;

    for(let i = draw_start_x - draw_origin_x; i <= cw / draw_unit; i ++){
        let alpha = ((Math.floor(i) - draw_origin_x) % 2 === 0 ? 1 : Math.min(1, draw_unit / 10 - 5));
        let x = sx + i * draw_unit - 0.5;
        if (x < cx) continue;
        let y = sy + this.SCALE_PLATE_WIDTH * (1 - alpha * 0.6);
        let height = this.SCALE_PLATE_WIDTH - y;
        this.fillRect(x, y, 1, height, 0xd3d3d3, alpha);

        this._temp_context.fillStyle = 'rgba(0, 0, 0, ' + ((Math.floor(i) - draw_origin_x) % 2 === 0 ? 1 : (draw_unit / 10 - 5)) +')';
        let point = Math.round((Math.floor(i) - draw_origin_x) * Graphics.GRID_UNIT_LENGTH * unit_scale);
        // this.fillText(String(point / 2), x + 1, sy + this.SCALE_PLATE_WIDTH - 2, 0,
        //   8, 'grey', 'left', 'top');
        let text_width = this._temp_context.measureText(String(point / 2)).width;
        x = i * draw_unit - text_width - 2;
        y = sy + this.SCALE_PLATE_WIDTH - 3;
        this._temp_context.fillText(String(point / 2), x, y);
    }
    for(let i = draw_start_y - draw_origin_y; i <= ch / draw_unit; i ++){
        let alpha = ((Math.floor(i) - draw_origin_y) % 2 === 0 ? 1 : Math.min(1, draw_unit / 10 - 5));
        let x = sx + Graphics.SCALE_PLATE_WIDTH * (1 - alpha * 0.6);
        let y = sy + i * draw_unit - 0.5;
        if (y < cy) continue;
        let width = Graphics.SCALE_PLATE_WIDTH - x;
        this.fillRect(x, y, width, 1, 0xd3d3d3, alpha);

        this._temp_context.fillStyle = 'rgba(0, 0, 0, ' + ((Math.floor(i) - draw_origin_y) % 2 === 0 ? 1 : (draw_unit / 10 - 5)) +')';
        let point = Math.round((Math.floor(i) - draw_origin_y) * Graphics.GRID_UNIT_LENGTH * unit_scale);
        // this.fillText(String(point / 2), sx + this.SCALE_PLATE_WIDTH + 1, y - 1, 0,
        //   8, 'grey', 'left', 'top');
        let text_width = this._temp_context.measureText(String(point / 2)).width;
        x = sy + this.SCALE_PLATE_WIDTH - text_width - 3;
        y = i * draw_unit - 3;
        this._temp_context.fillText(String(point / 2), x, y);
    }

    this.renderTempTexture();
};

Graphics.prototype.calcContentRectangle = function(){
    if(!this._canvas) return new Rectangle2D(0, 0, 0, 0);
    if(this._draw_scale_plate){
        return new Rectangle2D(this.SCALE_PLATE_WIDTH, this.SCALE_PLATE_WIDTH,
            this._canvas.width - this.SCALE_PLATE_WIDTH, this._canvas.height - this.SCALE_PLATE_WIDTH);
    }else{
        return new Rectangle2D(0, 0, this._canvas.width, this._canvas.height);
    }
};
// ================================================================================
// * Module exports
// --------------------------------------------------------------------------------
/**
 * Module exports.
 * @public
 */
// --------------------------------------------------------------------------------
module.exports = Graphics;
// ================================================================================



// --------------------------------------------------------------------------------
// * Image
// --------------------------------------------------------------------------------
Graphics.setImage = async function(src){
    if(!src) return this.clearImage();
    await this.loadImage(src);
    this._scale = this.calcImageScale();
    this._origin = this.calcImageOrigin();
    this.updateImageTexture();
    this.refresh();
};
Graphics.clearImage = function(){
    this.reset();
    this.refresh();
};
// --------------------------------------------------------------------------------
Graphics.loadImage = function(src){
    return new Promise((resolve) => {
        Graphics._image = new Image();
        Graphics._image.setAttribute("crossOrigin",'anonymous')
        let func1 = function(){
            let canvas = document.createElement('canvas');
            let ctx = canvas.getContext('2d');
            canvas.width = Graphics._image.width;
            canvas.height = Graphics._image.height;
            ctx.drawImage(Graphics._image, 0, 0);
            Graphics._image.removeEventListener('load', func1);
            let func2 = function(){
                Graphics._image.removeEventListener('load', func2);
                resolve();
            }
            Graphics._image.addEventListener('load', func2);
            Graphics._image.src = canvas.toDataURL();
        }
        Graphics._image.addEventListener('load', func1);
        Graphics._image.src = src;
    });
};
Graphics.calcImageRectangle = function(){
    let iw = this._image.width;
    let ih = this._image.height;
    let w = iw * this._scale;
    let h = ih * this._scale;
    return new Rectangle2D(this._origin.x, this._origin.y, w, h);
};

// --------------------------------------------------------------------------------
// * Temp
// --------------------------------------------------------------------------------
Graphics.clearTempCanvas = function(){
    this._text_canvas.width = this._canvas.width;
    this._text_canvas.height = this._canvas.height;
    this._text_context.clearRect(0, 0, this._canvas.width, this._canvas.height);
    this._temp_canvas.width = this._canvas.width;
    this._temp_canvas.height = this._canvas.height;
    this._temp_context.clearRect(0, 0, this._canvas.width, this._canvas.height);
};
Graphics.updateTempTexture = function(){
    this._text_texture.update();
    this._temp_texture.update();
};
Graphics.updateImageTexture = function(){
    if(this._image_texture) this._image_texture.destroy();
    this._image_texture = this._PIXI.Texture.from(this._image);
};
Graphics.renderTextTexture = function(){
    this._text_texture.update();
    this.drawTexture(this._text_texture, 0, 0, this._text_canvas.width, this._text_canvas.height, 1);
};
Graphics.renderTempTexture = function(){
    this._temp_texture.update();
    this.drawTexture(this._temp_texture, 0, 0, this._temp_canvas.width, this._temp_canvas.height, 1);
};
Graphics.renderImageTexture = function(rect){
    if(!this._image_texture) return;
    this.drawTexture(this._image_texture, rect.x, rect.y, rect.width, rect.height, rect.width / this._image_texture.width);
};
// --------------------------------------------------------------------------------
// * Origin
// --------------------------------------------------------------------------------
Graphics.setOrigin = function(origin){
    this._origin = origin;
    this.refresh();
};
// --------------------------------------------------------------------------------
Graphics.moveOrigin = function(x, y){
    this.setOrigin(new Point(this._origin.x + x, this._origin.y + y));
};
// --------------------------------------------------------------------------------
Graphics.calcInitialOrigin = function(){
    if(!this._image){
        if(this._canvas){
            return new Point(this._content_rect.x + this._content_rect.width / 2,
                this._content_rect.y + this._content_rect.height / 2);
        }else{
            return new Point(this._content_rect.x, this._content_rect.y);
        }
    }
    return this.calcImageOrigin();
};
Graphics.calcImageOrigin = function(){
    let iw = this._image.width;
    let ih = this._image.height;
    let cw = this._content_rect.width;
    let ch = this._content_rect.height;

    let x = this._content_rect.x;
    let y = this._content_rect.y;
    let w = 0;
    let h = 0;
    if(ih / iw > ch / cw){
        w = iw * (ch / ih)
        x += (cw - w)/2;
    }else{
        h = ih * (cw / iw);
        y += (ch - h)/2;
    }
    return new Point(x, y);
};
// --------------------------------------------------------------------------------
// * Scale
// --------------------------------------------------------------------------------
Graphics.setScale = function(scale){
    this._scale = scale;
    this.refresh();
};
// --------------------------------------------------------------------------------
Graphics.addScale = function(scale){
    this.setScale(Math.max(this.MIN_SCALE, Math.min(this._scale + scale, this.MAX_SCALE)));
};
Graphics.multiScale = function(scale){
    this.setScale(Math.max(this.MIN_SCALE, Math.min(this._scale * scale, this.MAX_SCALE)));
};
// --------------------------------------------------------------------------------
Graphics.calcImageScale = function(){
    let iw = this._image.width;
    let ih = this._image.height;
    let cw = this._content_rect.width;
    let ch = this._content_rect.height;
    let w = (ih / iw > ch / cw) ? iw * (ch / ih) : cw;
    return w / iw;
};
// --------------------------------------------------------------------------------
// * Update & Refresh
// --------------------------------------------------------------------------------
Graphics.update = function(){
    this.refresh();
};
// --------------------------------------------------------------------------------
Graphics.refresh = function(){
    try{
        this.forceRefresh();
    }catch(error){
        HistoryManager.undo().then(r => {
            HistoryManager.clearRight();
            let text = Language.get(Language.Type.System, 'graphics-error');
            Engine.alert(Engine, text + error.stack, function(){});
        })
    }
};
Graphics.forceRefresh = function(){
    if (!Engine.checkRouter('Editor')) return;

    if(!this._canvas) return;

    this.clear();
    this.clearTempCanvas();
    this._content_rect = this.calcContentRectangle();

    if(this._image){
        this._image_rect = this.calcImageRectangle();
        this.renderImageTexture(this._image_rect);
    }

    if(this._draw_grid)
        this.drawGrid();

    CollideManager.update();
    RenderManager.callRenderer(this._context);

    this.renderTextTexture();

    if(this._draw_scale_plate)
        this.drawScalePlate();
};
// --------------------------------------------------------------------------------
// * Draw Parts
// --------------------------------------------------------------------------------
Graphics.drawGrid = function(){
    let scaled_unit = this.GRID_UNIT_LENGTH * this._scale;
    let draw_unit = 0;
    let unit_scale = 1;
    if(scaled_unit < this.GRID_UNIT_LIMIT) {
        for(let i = scaled_unit; i < this.GRID_UNIT_LIMIT; i *= 2){
            draw_unit = i;
            unit_scale *= 2;
        }
    }else{
        for(let i = scaled_unit; i > this.GRID_UNIT_LIMIT / 2; i /= 2){
            draw_unit = i;
            unit_scale /= 2;
        }
    }
    let draw_start_x = this._origin.x / draw_unit;
    let draw_start_y = this._origin.y / draw_unit;
    let draw_origin_x = Math.floor(draw_start_x);
    let draw_origin_y = Math.floor(draw_start_y);

    let sx = 0;
    let sy = 0;
    let cw = this._canvas.width;
    let ch = this._canvas.height;

    for(let i = draw_start_x - draw_origin_x; i <= cw / draw_unit; i ++){
        let alpha = ((Math.floor(i) - draw_origin_x) % 2 === 0 ? 1 : Math.min(1, draw_unit / 10 - 5));
        this.fillRect(sx + i * draw_unit - 0.5, sy, 1, ch, 0xd3d3d3, alpha);
    }
    for(let i = draw_start_y - draw_origin_y; i <= ch / draw_unit; i ++){
        let alpha = ((Math.floor(i) - draw_origin_y) % 2 === 0 ? 1 : Math.min(1, draw_unit / 10 - 5));
        this.fillRect(sx, sy + i * draw_unit - 0.5, cw, 1, 0xd3d3d3, alpha);
    }
};
Graphics.drawScalePlate = function(){
    this.fillRect(0, 0, this.SCALE_PLATE_WIDTH, this._canvas.height, 0xf5f5f5, 1);
    this.fillRect(0, 0, this._canvas.width, this.SCALE_PLATE_WIDTH, 0xf5f5f5, 1);
    this.fillRect(this._content_rect.x - 1, this._content_rect.y - 1, 1, this._content_rect.height,
        0xd3d3d3, 1);
    this.fillRect(this._content_rect.x - 1, this._content_rect.y - 1, this._content_rect.width, 1,
        0xd3d3d3, 1);

    this._temp_context.font = '8px Arial';

    let scaled_unit = this.GRID_UNIT_LENGTH * this._scale;
    let draw_unit = 0;
    let unit_scale = 1;
    if(scaled_unit < this.GRID_UNIT_LIMIT) {
        for(let i = scaled_unit; i < this.GRID_UNIT_LIMIT; i *= 2){
            draw_unit = i;
            unit_scale *= 2;
        }
    }else{
        for(let i = scaled_unit; i > this.GRID_UNIT_LIMIT / 2; i /= 2){
            draw_unit = i;
            unit_scale /= 2;
        }
    }
    let draw_start_x = this._origin.x / draw_unit;
    let draw_start_y = this._origin.y / draw_unit;
    let draw_origin_x = Math.floor(draw_start_x);
    let draw_origin_y = Math.floor(draw_start_y);

    let sx = 0;
    let sy = 0;
    let cw = this._canvas.width;
    let ch = this._canvas.height;

    let cx = this._content_rect.x;
    let cy = this._content_rect.y;

    for(let i = draw_start_x - draw_origin_x; i <= cw / draw_unit; i ++){
        let alpha = ((Math.floor(i) - draw_origin_x) % 2 === 0 ? 1 : Math.min(1, draw_unit / 10 - 5));
        let x = sx + i * draw_unit - 0.5;
        if (x < cx) continue;
        let y = sy + this.SCALE_PLATE_WIDTH * (1 - alpha * 0.6);
        let height = this.SCALE_PLATE_WIDTH - y;
        this.fillRect(x, y, 1, height, 0xd3d3d3, alpha);

        this._temp_context.fillStyle = 'rgba(0, 0, 0, ' + ((Math.floor(i) - draw_origin_x) % 2 === 0 ? 1 : (draw_unit / 10 - 5)) +')';
        let point = Math.round((Math.floor(i) - draw_origin_x) * this.GRID_UNIT_LENGTH * unit_scale);
        // this.fillText(String(point / 2), x + 1, sy + this.SCALE_PLATE_WIDTH - 2, 0,
        //   8, 'grey', 'left', 'top');
        let text_width = this._temp_context.measureText(String(point / 2)).width;
        x = i * draw_unit - text_width - 2;
        y = sy + this.SCALE_PLATE_WIDTH - 3;
        this._temp_context.fillText(String(point / 2), x, y);
    }
    for(let i = draw_start_y - draw_origin_y; i <= ch / draw_unit; i ++){
        let alpha = ((Math.floor(i) - draw_origin_y) % 2 === 0 ? 1 : Math.min(1, draw_unit / 10 - 5));
        let x = sx + this.SCALE_PLATE_WIDTH * (1 - alpha * 0.6);
        let y = sy + i * draw_unit - 0.5;
        if (y < cy) continue;
        let width = this.SCALE_PLATE_WIDTH - x;
        this.fillRect(x, y, width, 1, 0xd3d3d3, alpha);

        this._temp_context.fillStyle = 'rgba(0, 0, 0, ' + ((Math.floor(i) - draw_origin_y) % 2 === 0 ? 1 : (draw_unit / 10 - 5)) +')';
        let point = Math.round((Math.floor(i) - draw_origin_y) * this.GRID_UNIT_LENGTH * unit_scale);
        // this.fillText(String(point / 2), sx + this.SCALE_PLATE_WIDTH + 1, y - 1, 0,
        //   8, 'grey', 'left', 'top');
        let text_width = this._temp_context.measureText(String(point / 2)).width;
        x = sy + this.SCALE_PLATE_WIDTH - text_width - 3;
        y = i * draw_unit - 3;
        this._temp_context.fillText(String(point / 2), x, y);
    }

    this.renderTempTexture();
};
// --------------------------------------------------------------------------------

// --------------------------------------------------------------------------------
// * Point Transition
// --------------------------------------------------------------------------------
Graphics.getSourcePoint = function(point){
    return point.minus(this._origin).division(this._scale);
};
Graphics.getRenderPoint = function(point){
    return point.multiply(this._scale).add(this._origin);
};
// --------------------------------------------------------------------------------
Graphics.getScaledPoint = function(point){
    return point.division(this._scale);
};
// --------------------------------------------------------------------------------
Graphics.getMouseSourcePoint = function(){
    let mouse_point = MouseInput.getMousePoint();
    return mouse_point ? this.getSourcePoint(mouse_point) : null;
};
// --------------------------------------------------------------------------------
// * Line Transition
// --------------------------------------------------------------------------------
Graphics.getSourceLine = function(line){
    return new Line(this.getSourcePoint(line.start), this.getSourcePoint(line.end));
};
Graphics.getRenderLine = function(line){
    return new Line(this.getRenderPoint(line.start), this.getRenderPoint(line.end));
};
// --------------------------------------------------------------------------------
// * Polygon2D Transition
// --------------------------------------------------------------------------------
Graphics.getSourcePolygon = function(polygon){
    let points = [];
    for(let i = 0; i < polygon.points.length; i++){
        points.push(this.getSourcePoint(polygon.points[i]));
    }
    return new Polygon2D(points);
};
Graphics.getRenderPolygon = function(polygon){
    let points = [];
    for(let i = 0; i < polygon.points.length; i++){
        points.push(this.getRenderPoint(polygon.points[i]));
    }
    return new Polygon2D(points);
};

// ================================================================================
