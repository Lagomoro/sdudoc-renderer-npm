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
const PIXI        = require("pixi.js");
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
Graphics.prototype._layers = [];
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
    this._layers = [];

    this._canvas = canvas;
    this._context = this._canvas.getContext('2d');
    this._texture = PIXI.Texture.from(this._canvas);
};
Graphics.prototype.clear = function(){
    this._grid.clear();

    this._canvas = null;
    this._context = null;
    this._texture = null;

    for(let)
    this._layers = [];
};
// --------------------------------------------------------------------------------
// * Refresh Frame
// --------------------------------------------------------------------------------
Graphics.prototype.update = function(){
    this.refresh();
};
// --------------------------------------------------------------------------------
Graphics.prototype.refresh = function(){
    if (!this._canvas) return;

    this._context.clear();
    this.drawBottomLayers();
    if (Graphics.DRAW_GRID) this.drawGrid();
    this.drawTopLayers();
    if (Graphics.DRAW_SCALE_PLATE) this.drawScalePlate();
};
// --------------------------------------------------------------------------------
// * Draw Parts
// --------------------------------------------------------------------------------
Graphics.prototype.drawBottomLayers = function(){

}
Graphics.prototype.drawGrid = function(){
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
Graphics.prototype.drawTopLayers = function(){

}
Graphics.prototype.drawScalePlate = function(){
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
// * Constant
// --------------------------------------------------------------------------------
Graphics.MIN_SCALE = 0.025;
Graphics.MAX_SCALE = 5;
// --------------------------------------------------------------------------------
// * Property
// --------------------------------------------------------------------------------
Graphics._draw_grid = true;
Graphics._draw_scale_plate = true;
// --------------------------------------------------------------------------------
Graphics._PIXI = null;
Graphics._canvas = null;
Graphics._context = null;
// --------------------------------------------------------------------------------
Graphics._content_rect = null;
// --------------------------------------------------------------------------------
Graphics._temp_canvas = null;
Graphics._temp_context = null;
Graphics._temp_texture = null;
Graphics._text_canvas = null;
Graphics._text_context = null;
Graphics._text_texture = null;
// --------------------------------------------------------------------------------
Graphics._image = null;
Graphics._image_rect = null;
Graphics._image_texture = null;
// --------------------------------------------------------------------------------
Graphics._origin = null;
Graphics._scale = 1;
// --------------------------------------------------------------------------------
// * Initialize
// --------------------------------------------------------------------------------
Graphics.initialize = function(){
    this._PIXI = null;
    this._canvas = null;
    this._context = null;
    this._content_rect = null;

    this._temp_canvas = null;
    this._temp_context = null;
    this._temp_texture = null;
    this._text_canvas = null;
    this._text_context = null;
    this._text_texture = null;
};
Graphics.reset = function(){
    this._image = null;
    this._image_rect = null;
    this._image_texture = null;
    this._origin = this.calcInitialOrigin();
    this._scale = 1;
};
Graphics.initializeEditor = function(editor){
    this._PIXI = editor.pixi;
    this._canvas = editor.pixi_app.view;
    this._context = editor.pixi_context;
    this._content_rect = this.calcContentRectangle();
    this.initializeTempCanvas();
    this.reset();
    this.refresh();
};
Graphics.initializeTempCanvas = function(){
    this._temp_canvas = document.createElement('canvas');
    this._temp_context = this._temp_canvas.getContext('2d');
    this._temp_texture = this._PIXI.Texture.from(this._temp_canvas);
    this._text_canvas = document.createElement('canvas');
    this._text_context = this._text_canvas.getContext('2d');
    this._text_texture = this._PIXI.Texture.from(this._text_canvas);
};
// --------------------------------------------------------------------------------
// * Getter & Setter
// --------------------------------------------------------------------------------
Object.defineProperty(Graphics, 'origin', {
    get: function() {
        return this._origin;
    },
    configurable: true
});
Object.defineProperty(Graphics, 'scale', {
    get: function() {
        return this._scale;
    },
    configurable: true
});
Object.defineProperty(Graphics, 'image', {
    get: function() {
        return this._image;
    },
    configurable: true
});
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
Graphics.calcContentRectangle = function(){
    if(!this._canvas) return new Rectangle2D(0, 0, 0, 0);
    if(this._draw_scale_plate){
        return new Rectangle2D(this.SCALE_PLATE_WIDTH, this.SCALE_PLATE_WIDTH,
            this._canvas.width - this.SCALE_PLATE_WIDTH, this._canvas.height - this.SCALE_PLATE_WIDTH);
    }else{
        return new Rectangle2D(0, 0, this._canvas.width, this._canvas.height);
    }
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
// --------------------------------------------------------------------------------
// * Paint
// --------------------------------------------------------------------------------
Graphics.clear = function(){
    this._context.clear();
};
// --------------------------------------------------------------------------------
// * Paint With List
// --------------------------------------------------------------------------------
Graphics.drawPointList = function(point_list, radius, fill_color, fill_alpha, line_width, line_color, line_alpha){
    this._context.lineStyle(line_width, line_color, line_alpha, 1);
    this._context.beginFill(fill_color, fill_alpha);
    for(let i = 0; i < point_list.length; i++) {
        this._context.drawCircle(point_list[i].x, point_list[i].y, radius);
    }
    this._context.endFill();
    this._context.lineStyle(0);
};
Graphics.drawPolygonList = function(polygon_list, fill_color, fill_alpha, line_width, line_color, line_alpha){
    this._context.lineStyle(line_width, line_color, line_alpha, 1);
    this._context.beginFill(fill_color, fill_alpha);
    for(let i = 0; i < polygon_list.length; i++) {
        this._context.drawPolygon(polygon_list[i].getRenderArray());
    }
    this._context.endFill();
    this._context.lineStyle(0);
};
Graphics.fillPolygonList = function(polygon_list, color, alpha){
    this.drawPolygonList(polygon_list, color, alpha, 0, 0, 0);
};
// --------------------------------------------------------------------------------
// * Paint Rectangle2D
// --------------------------------------------------------------------------------
Graphics.drawRect = function(x, y, width, height, fill_color, fill_alpha, line_width, line_color, line_alpha){
    this._context.lineStyle(line_width, line_color, line_alpha, 1);
    this._context.beginFill(fill_color, fill_alpha);
    this._context.drawRect(x, y, width, height);
    this._context.endFill();
    this._context.lineStyle(0);
};
Graphics.fillRect = function(x, y, width, height, color, alpha){
    this.drawRect(x, y, width, height, color, alpha, 0, 0, 0);
};
Graphics.strokeRect = function(x, y, width, height, line_width, color, alpha){
    this.drawRect(x, y, width, height, 0, 0, line_width, color, alpha);
};
// --------------------------------------------------------------------------------
Graphics.drawRectangle = function(rect, fill_color, fill_alpha, line_width, line_color, line_alpha){
    this.drawRect(rect.x, rect.y, rect.width, rect.height, fill_color, fill_alpha, line_width, line_color, line_alpha);
};
Graphics.fillRectangle = function(rect, color, alpha){
    this.fillRect(rect.x, rect.y, rect.width, rect.height, color, alpha);
};
Graphics.strokeRectangle = function(rect, line_width, color, alpha){
    this.strokeRect(rect.x, rect.y, rect.width, rect.height, line_width, color, alpha);
};
// --------------------------------------------------------------------------------
// * Paint Circle
// --------------------------------------------------------------------------------
Graphics.drawCircle = function(x, y, radius, fill_color, fill_alpha, line_width, line_color, line_alpha){
    this._context.lineStyle(line_width, line_color, line_alpha, 1);
    this._context.beginFill(fill_color, fill_alpha);
    this._context.drawCircle(x, y, radius);
    this._context.endFill();
    this._context.lineStyle(0);
};
Graphics.fillCircle = function(x, y, radius, color, alpha){
    this.drawCircle(x, y, radius, color, alpha, 0, 0, 0);
};
Graphics.strokeCircle = function(x, y, radius, line_width, color, alpha){
    this.drawCircle(x, y, radius, 0, 0, line_width, color, alpha);
};
// --------------------------------------------------------------------------------
Graphics.drawPoint = function(point, radius, fill_color, fill_alpha, line_width, line_color, line_alpha){
    this.drawCircle(point.x, point.y, radius, fill_color, fill_alpha, line_width, line_color, line_alpha);
};
Graphics.fillPoint = function(point, radius, color, alpha){
    this.fillCircle(point.x, point.y, radius, color, alpha);
};
Graphics.strokePoint = function(point, radius, line_width, color, alpha){
    this.strokeCircle(point.x, point.y, radius, line_width, color, alpha);
};
// --------------------------------------------------------------------------------
// * Paint Polygon2D
// --------------------------------------------------------------------------------
Graphics.drawPolygonArray = function(polygon_array, fill_color, fill_alpha, line_width, line_color, line_alpha){
    this._context.lineStyle(line_width, line_color, line_alpha, 1);
    this._context.beginFill(fill_color, fill_alpha);
    this._context.drawPolygon(polygon_array);
    this._context.endFill();
    this._context.lineStyle(0);
};
Graphics.fillPolygonArray = function(polygon_array, color, alpha){
    this.drawPolygonArray(polygon_array, color, alpha, 0, 0, 0);
};
Graphics.strokePolygonArray = function(polygon_array, line_width, color, alpha){
    this.drawPolygonArray(polygon_array, 0, 0, line_width, color, alpha);
};
// --------------------------------------------------------------------------------
Graphics.drawPolygon = function(polygon, fill_color, fill_alpha, line_width, line_color, line_alpha){
    this.drawPolygonArray(polygon.getRenderArray(), fill_color, fill_alpha, line_width, line_color, line_alpha);
};
Graphics.fillPolygon = function(polygon, color, alpha){
    this.fillPolygonArray(polygon.getRenderArray(), color, alpha);
};
Graphics.strokePolygon = function(polygon, line_width, color, alpha){
    this.strokePolygonArray(polygon.getRenderArray(), line_width, color, alpha);
};
// --------------------------------------------------------------------------------
// * Text
// --------------------------------------------------------------------------------
Graphics.calcTextRenderBuffer = function(text, size, color, align){
    let style = {
        fontFamily: 'Arial',
        fontSize: size,
        fill: color,
        align: align
    }

    let text_style = new this._PIXI.TextStyle(style);
    let text_metrics = this._PIXI.TextMetrics.measureText(text, text_style);
    let pixi_text = new this._PIXI.Text(text, text_style);
    pixi_text.updateText();

    return {
        text_metrics: text_metrics,
        texture : pixi_text.texture
    }
};
// --------------------------------------------------------------------------------
Graphics._calcTextMatrix = function(text_metrics, x, y, width, align_x, align_y){
    let background_x = 0;
    let background_width = 0;
    let text_x = 0;
    if(width > 0){
        background_width = width;
        background_x = x;
        switch (align_x){
            case 'left': default: text_x = x; break;
            case 'center': text_x = x + (background_width - text_metrics.width) / 2; break;
            case 'right': text_x = x + background_width - text_metrics.width; break;
        }
    }else{
        background_width = text_metrics.width + text_metrics.height * 0.6;
        if (text_metrics.width < text_metrics.height){
            background_width = text_metrics.height;
        }
        switch (align_x){
            case 'left': default: text_x = x - (background_width + text_metrics.width) / 2; break;
            case 'center': text_x = x - text_metrics.width / 2; break;
            case 'right': text_x = x + (background_width - text_metrics.width) / 2; break;
        }
        background_x = text_x - (background_width - text_metrics.width) / 2;
    }

    let text_y = 0;
    switch (align_y){
        case 'top': default: text_y = y - text_metrics.height; break;
        case 'center': text_y = y - text_metrics.height / 2; break;
        case 'bottom': text_y = y; break;
    }

    return {
        text_x: text_x,
        text_y: text_y,
        background_x: background_x,
        background_width: background_width
    }
}
Graphics._fillTextText = function(texture, x, y, width, height){
    this._context.beginTextureFill({
        texture: texture,
        matrix: new this._PIXI.Matrix(1, 0, 0, 1, x, y)
    });
    this._context.drawRect(x, y, width, height);
    this._context.endFill();
}
Graphics._fillTextBackground = function(x, y, width, height, radius,
                                        fill_color, fill_alpha, line_width, line_color, line_alpha){
    this._context.lineStyle(line_width, line_color, line_alpha, 1);
    this._context.beginFill(fill_color, fill_alpha);
    this._context.drawRoundedRect(x, y, width, height, radius);
    this._context.endFill();
    this._context.lineStyle(0);
};
// --------------------------------------------------------------------------------
Graphics.drawTextWithBuffer = function(buffer, x, y, width, align_x, align_y,
                                       background_color, background_alpha, line_width, line_color, line_alpha){
    let text_metrics = buffer.text_metrics;
    let texture = buffer.texture;

    let matrix = this._calcTextMatrix(text_metrics, x, y, width, align_x, align_y);

    let text_x = matrix.text_x;
    let text_y = matrix.text_y;
    let background_x = matrix.background_x;
    let background_width = matrix.background_width;

    this._fillTextBackground(background_x, text_y, background_width, text_metrics.height, text_metrics.height / 2,
        background_color, background_alpha, line_width, line_color, line_alpha);
    this._fillTextText(texture, text_x, text_y, text_metrics.width, text_metrics.height);

    // Test:
    // this.fillCircle(x, y, 2, 0xff0000, 1);
};
Graphics.fillTextWithBuffer = function(buffer, x, y, width, align_x, align_y){
    let text_metrics = buffer.text_metrics;
    let texture = buffer.texture;

    let matrix = this._calcTextMatrix(text_metrics, x, y, width, align_x, align_y);

    let text_x = matrix.text_x;
    let text_y = matrix.text_y;

    this._fillTextText(texture, text_x, text_y, text_metrics.width, text_metrics.height);

    // Test:
    // this.fillCircle(x, y, 2, 0xff0000, 1);
};
Graphics.drawText = function(text, x, y, width, size, text_color, align_x, align_y,
                             background_color, background_alpha, line_width, line_color, line_alpha){
    let buffer = this.calcTextRenderBuffer(text, size, text_color, align_x);
    this.drawTextWithBuffer(buffer, x, y, width, align_x, align_y, background_color, background_alpha, line_width, line_color, line_alpha)
};
Graphics.fillText = function(text, x, y, width, size, text_color, align_x, align_y){
    let buffer = this.calcTextRenderBuffer(text, size, text_color, align_x);
    this.fillTextWithBuffer(buffer, x, y, width, align_x, align_y);
};
// --------------------------------------------------------------------------------
// * Canvas Text
// --------------------------------------------------------------------------------
Graphics._fillTextCanvasText = function(text, x, y, width, height, text_color){
    this._text_context.fillStyle = text_color;
    this._text_context.fillText(text, x, y);
}
Graphics._fillTextCanvasBackground = function(x, y, width, height, radius, fill_color, line_width, line_color){
    this._text_context.fillStyle = fill_color;
    this._text_context.strokeStyle = line_color;
    this._text_context.lineWidth = line_width;
    if(Math.abs(width - height) < 0.01){
        this._text_context.beginPath();
        this._text_context.arc(x + width / 2, y + height / 2, width / 2, 0, 360, false);
        this._text_context.closePath();
        this._text_context.fill();
        this._text_context.stroke();
    }else{
        let left_x = x + height / 2;
        let right_x = x + width - height / 2;
        let oy = y + height / 2;
        this._text_context.beginPath();
        this._text_context.moveTo(right_x, y);
        this._text_context.arc(right_x, oy, radius, - Math.PI / 2, Math.PI / 2, false);
        this._text_context.lineTo(left_x, y + height);
        this._text_context.arc(left_x, oy, radius, Math.PI / 2, Math.PI / 2 * 3, false);
        this._text_context.closePath();
        this._text_context.fill();
        this._text_context.stroke();
    }
};
// --------------------------------------------------------------------------------
Graphics.drawTextCanvas = function(text, x, y, width, size, text_color, align_x, align_y,
                                   background_color, line_width, line_color){
    this._text_context.save();
    this._text_context.font = size + ' Arial';
    let text_metrics = this._text_context.measureText(text)
    text_metrics.height = text_metrics.fontBoundingBoxAscent + text_metrics.fontBoundingBoxDescent;

    let matrix = this._calcTextMatrix(text_metrics, x, y, width, align_x, align_y);

    let text_x = matrix.text_x;
    let text_y = matrix.text_y;
    let background_x = matrix.background_x - 1;
    let background_width = matrix.background_width + 2;

    let background_y = matrix.text_y - 1;
    let canvas_text_height = text_metrics.height + 2;

    this._fillTextCanvasBackground(background_x, background_y, background_width, canvas_text_height, canvas_text_height / 2,
        background_color, line_width, line_color);

    let canvas_text_y = text_y + text_metrics.fontBoundingBoxAscent;
    this._fillTextCanvasText(text, text_x, canvas_text_y, text_metrics.width, canvas_text_height, text_color);
    this._text_context.restore();

    // Test:
    // this.fillCircle(x, y, 2, 0xff0000, 1);
};
Graphics.fillTextCanvas = function(text, x, y, width, size, text_color, align_x, align_y){
    this._text_context.save();
    this._text_context.font = size + ' Arial';
    let text_metrics = this._text_context.measureText(text);

    let matrix = this._calcTextMatrix(text_metrics, x, y, width, align_x, align_y);

    let text_x = matrix.text_x;
    let text_y = matrix.text_y;

    let canvas_text_y = text_y + text_metrics.fontBoundingBoxAscent;
    this._fillTextCanvasText(text, text_x, canvas_text_y, text_metrics.width, text_metrics.height, text_color);

    // Test:
    // this.fillCircle(x, y, 2, 0xff0000, 1);
};
// --------------------------------------------------------------------------------
// * Image
// --------------------------------------------------------------------------------
// ! Cause Memory Leak
Graphics.drawImage = function(image, x, y, width, height){
    this.drawTexture(this._PIXI.Texture.from(image), x, y, width, height, width / this._image.width);
};
// ! Cause Memory Leak
Graphics.drawCanvas = function(canvas, x, y, width, height){
    this.drawTexture(this._PIXI.Texture.from(canvas), x, y, width, height, 1);
};
Graphics.drawTexture = function(texture, x, y, width, height, scale){
    this._context.beginTextureFill({
        texture: texture,
        matrix: new this._PIXI.Matrix(scale, 0, 0, scale, x, y)
    });
    this._context.drawRect(x, y, width, height);
    this._context.endFill();
};
// ================================================================================
