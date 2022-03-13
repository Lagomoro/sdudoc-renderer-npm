'use strict'

// ================================================================================
// * GraphicsUtil <SDUDOC Renderer>
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
// * GraphicsUtil
// --------------------------------------------------------------------------------
function GraphicsUtil(){
    throw new Error('This is a static class');
}
// --------------------------------------------------------------------------------
// * Paint With List
// --------------------------------------------------------------------------------
GraphicsUtil.drawPointList = function(ctx, point_list, radius, fill_color, fill_alpha, line_width, line_color, line_alpha){
    ctx.lineStyle(line_width, line_color, line_alpha, 1);
    ctx.beginFill(fill_color, fill_alpha);
    for(let i = 0; i < point_list.length; i++) {
        ctx.drawCircle(point_list[i].x, point_list[i].y, radius);
    }
    ctx.endFill();
    ctx.lineStyle(0);
};
GraphicsUtil.drawPolygonList = function(ctx, polygon_list, fill_color, fill_alpha, line_width, line_color, line_alpha){
    ctx.lineStyle(line_width, line_color, line_alpha, 1);
    ctx.beginFill(fill_color, fill_alpha);
    for(let i = 0; i < polygon_list.length; i++) {
        ctx.drawPolygon(polygon_list[i].getRenderArray());
    }
    ctx.endFill();
    ctx.lineStyle(0);
};
GraphicsUtil.fillPolygonList = function(ctx, polygon_list, color, alpha){
    this.drawPolygonList(polygon_list, color, alpha, 0, 0, 0);
};
// --------------------------------------------------------------------------------
// * Paint Rectangle2D
// --------------------------------------------------------------------------------
GraphicsUtil.drawRect = function(ctx, x, y, width, height, fill_color, fill_alpha, line_width, line_color, line_alpha){
    ctx.lineStyle(line_width, line_color, line_alpha, 1);
    ctx.beginFill(fill_color, fill_alpha);
    ctx.drawRect(x, y, width, height);
    ctx.endFill();
    ctx.lineStyle(0);
};
GraphicsUtil.fillRect = function(ctx, x, y, width, height, color, alpha){
    this.drawRect(x, y, width, height, color, alpha, 0, 0, 0);
};
GraphicsUtil.strokeRect = function(ctx, x, y, width, height, line_width, color, alpha){
    this.drawRect(x, y, width, height, 0, 0, line_width, color, alpha);
};
// --------------------------------------------------------------------------------
GraphicsUtil.drawRectangle = function(ctx, rect, fill_color, fill_alpha, line_width, line_color, line_alpha){
    this.drawRect(rect.x, rect.y, rect.width, rect.height, fill_color, fill_alpha, line_width, line_color, line_alpha);
};
GraphicsUtil.fillRectangle = function(ctx, rect, color, alpha){
    this.fillRect(rect.x, rect.y, rect.width, rect.height, color, alpha);
};
GraphicsUtil.strokeRectangle = function(ctx, rect, line_width, color, alpha){
    this.strokeRect(rect.x, rect.y, rect.width, rect.height, line_width, color, alpha);
};
// --------------------------------------------------------------------------------
// * Paint Circle
// --------------------------------------------------------------------------------
GraphicsUtil.drawCircle = function(ctx, x, y, radius, fill_color, fill_alpha, line_width, line_color, line_alpha){
    ctx.lineStyle(line_width, line_color, line_alpha, 1);
    ctx.beginFill(fill_color, fill_alpha);
    ctx.drawCircle(x, y, radius);
    ctx.endFill();
    ctx.lineStyle(0);
};
GraphicsUtil.fillCircle = function(ctx, x, y, radius, color, alpha){
    this.drawCircle(x, y, radius, color, alpha, 0, 0, 0);
};
GraphicsUtil.strokeCircle = function(ctx, x, y, radius, line_width, color, alpha){
    this.drawCircle(x, y, radius, 0, 0, line_width, color, alpha);
};
// --------------------------------------------------------------------------------
GraphicsUtil.drawPoint = function(ctx, point, radius, fill_color, fill_alpha, line_width, line_color, line_alpha){
    this.drawCircle(point.x, point.y, radius, fill_color, fill_alpha, line_width, line_color, line_alpha);
};
GraphicsUtil.fillPoint = function(ctx, point, radius, color, alpha){
    this.fillCircle(point.x, point.y, radius, color, alpha);
};
GraphicsUtil.strokePoint = function(ctx, point, radius, line_width, color, alpha){
    this.strokeCircle(point.x, point.y, radius, line_width, color, alpha);
};
// --------------------------------------------------------------------------------
// * Paint Polygon2D
// --------------------------------------------------------------------------------
GraphicsUtil.drawPolygonArray = function(ctx, polygon_array, fill_color, fill_alpha, line_width, line_color, line_alpha){
    ctx.lineStyle(line_width, line_color, line_alpha, 1);
    ctx.beginFill(fill_color, fill_alpha);
    ctx.drawPolygon(polygon_array);
    ctx.endFill();
    ctx.lineStyle(0);
};
GraphicsUtil.fillPolygonArray = function(ctx, polygon_array, color, alpha){
    this.drawPolygonArray(polygon_array, color, alpha, 0, 0, 0);
};
GraphicsUtil.strokePolygonArray = function(ctx, polygon_array, line_width, color, alpha){
    this.drawPolygonArray(polygon_array, 0, 0, line_width, color, alpha);
};
// --------------------------------------------------------------------------------
GraphicsUtil.drawPolygon = function(ctx, polygon, fill_color, fill_alpha, line_width, line_color, line_alpha){
    this.drawPolygonArray(polygon.getRenderArray(), fill_color, fill_alpha, line_width, line_color, line_alpha);
};
GraphicsUtil.fillPolygon = function(ctx, polygon, color, alpha){
    this.fillPolygonArray(polygon.getRenderArray(), color, alpha);
};
GraphicsUtil.strokePolygon = function(ctx, polygon, line_width, color, alpha){
    this.strokePolygonArray(polygon.getRenderArray(), line_width, color, alpha);
};
// --------------------------------------------------------------------------------
// * Text
// --------------------------------------------------------------------------------
GraphicsUtil.calcTextRenderBuffer = function(ctx, text, size, color, align){
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
GraphicsUtil._calcTextMatrix = function(ctx, text_metrics, x, y, width, align_x, align_y){
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
GraphicsUtil._fillTextText = function(ctx, texture, x, y, width, height){
    ctx.beginTextureFill({
        texture: texture,
        matrix: new this._PIXI.Matrix(1, 0, 0, 1, x, y)
    });
    ctx.drawRect(x, y, width, height);
    ctx.endFill();
}
GraphicsUtil._fillTextBackground = function(ctx, x, y, width, height, radius,
                                        fill_color, fill_alpha, line_width, line_color, line_alpha){
    ctx.lineStyle(line_width, line_color, line_alpha, 1);
    ctx.beginFill(fill_color, fill_alpha);
    ctx.drawRoundedRect(x, y, width, height, radius);
    ctx.endFill();
    ctx.lineStyle(0);
};
// --------------------------------------------------------------------------------
GraphicsUtil.drawTextWithBuffer = function(ctx, buffer, x, y, width, align_x, align_y,
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
GraphicsUtil.fillTextWithBuffer = function(ctx, buffer, x, y, width, align_x, align_y){
    let text_metrics = buffer.text_metrics;
    let texture = buffer.texture;

    let matrix = this._calcTextMatrix(text_metrics, x, y, width, align_x, align_y);

    let text_x = matrix.text_x;
    let text_y = matrix.text_y;

    this._fillTextText(texture, text_x, text_y, text_metrics.width, text_metrics.height);

    // Test:
    // this.fillCircle(x, y, 2, 0xff0000, 1);
};
GraphicsUtil.drawText = function(ctx, text, x, y, width, size, text_color, align_x, align_y,
                             background_color, background_alpha, line_width, line_color, line_alpha){
    let buffer = this.calcTextRenderBuffer(text, size, text_color, align_x);
    this.drawTextWithBuffer(buffer, x, y, width, align_x, align_y, background_color, background_alpha, line_width, line_color, line_alpha)
};
GraphicsUtil.fillText = function(ctx, text, x, y, width, size, text_color, align_x, align_y){
    let buffer = this.calcTextRenderBuffer(text, size, text_color, align_x);
    this.fillTextWithBuffer(buffer, x, y, width, align_x, align_y);
};
// --------------------------------------------------------------------------------
// * Canvas Text
// --------------------------------------------------------------------------------
GraphicsUtil._fillTextCanvasText = function(ctx, text, x, y, width, height, text_color){
    this._text_context.fillStyle = text_color;
    this._text_context.fillText(text, x, y);
}
GraphicsUtil._fillTextCanvasBackground = function(ctx, x, y, width, height, radius, fill_color, line_width, line_color){
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
GraphicsUtil.drawTextCanvas = function(ctx, text, x, y, width, size, text_color, align_x, align_y,
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
GraphicsUtil.fillTextCanvas = function(ctx, text, x, y, width, size, text_color, align_x, align_y){
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
GraphicsUtil.drawImage = function(ctx, image, x, y, width, height){
    this.drawTexture(this._PIXI.Texture.from(image), x, y, width, height, width / this._image.width);
};
// ! Cause Memory Leak
GraphicsUtil.drawCanvas = function(ctx, canvas, x, y, width, height){
    this.drawTexture(this._PIXI.Texture.from(canvas), x, y, width, height, 1);
};
GraphicsUtil.drawTexture = function(ctx, texture, x, y, width, height, scale){
    ctx.beginTextureFill({
        texture: texture,
        matrix: new this._PIXI.Matrix(scale, 0, 0, scale, x, y)
    });
    ctx.drawRect(x, y, width, height);
    ctx.endFill();
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
module.exports = GraphicsUtil;
// ================================================================================