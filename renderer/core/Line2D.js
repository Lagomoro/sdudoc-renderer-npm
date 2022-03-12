'use strict'

// ================================================================================
// * Line2D <SDUDOC Renderer>
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
const Point2D   = require('./Point2D');
const Polygon2D = require('./Polygon2D');
// ================================================================================

// ================================================================================
// * Line2D
// --------------------------------------------------------------------------------
function Line2D(){
  this.initialize.apply(this, arguments);
}
// --------------------------------------------------------------------------------
// * Property
// --------------------------------------------------------------------------------
Line2D.prototype._start = null;
Line2D.prototype._end = null;
// --------------------------------------------------------------------------------
// * Initialize
// --------------------------------------------------------------------------------
Line2D.prototype.initialize = function(start, end){
  this._start = start;
  this._end = end;
};
// --------------------------------------------------------------------------------
// * Getter & Setter
// --------------------------------------------------------------------------------
Object.defineProperty(Line2D.prototype, 'start', {
  get: function() { return this._start; },
  set: function(value) { this._start = value; },
  configurable: true
});
Object.defineProperty(Line2D.prototype, 'end', {
  get: function() { return this._end; },
  set: function(value) { this._end = value; },
  configurable: true
});
// --------------------------------------------------------------------------------
// * Functions
// --------------------------------------------------------------------------------
Line2D.prototype.getRenderPolygon = function(radius){
  let getEndpointDots = function(point, k, radius){
    let b = Math.sqrt(k * k + 1);
    let x1 = point.x + (radius / b);
    let x2 = point.x - (radius / b);
    let y1 = k * (x1 - point.x) + point.y;
    let y2 = k * (x2 - point.x) + point.y;
    return [new Point2D(x1, y1), new Point2D(x2, y2)];
  }
  let start = this._start.y > this._end.y ? this._start : this._end;
  let end = this._start.y > this._end.y ? this._end : this._start;
  if(Math.abs(start.y - end.y) < 0.01){
    return new Polygon2D([new Point2D(start.x, start.y + radius), new Point2D(start.x, start.y - radius),
      new Point2D(end.x, end.y - radius), new Point2D(end.x, end.y + radius)]);
  }else if(Math.abs(start.x - end.x) < 0.01){
    return new Polygon2D([new Point2D(start.x + radius, start.y), new Point2D(start.x - radius, start.y),
      new Point2D(end.x - radius, end.y), new Point2D(end.x + radius, end.y)]);
  }
  let k = -1.0 / ((start.y - end.y) / (start.x - end.x));
  let dot1 = getEndpointDots(start, k, radius);
  let dot2 = getEndpointDots(end, k, radius);
  return new Polygon2D([dot1[0], dot1[1], dot2[1], dot2[0]]);
};
// --------------------------------------------------------------------------------
Line2D.prototype.getIntersectionPoint = function(line){
  let l1_s = this._start;
  let l1_e = this._end;
  let l2_s = line.start;
  let l2_e = line.end;
  if(Math.abs(l1_s.x - l1_e.x) < 0.01){
    if(Math.abs(l2_s.x - l2_e.x) < 0.01){
      return new Point2D(0, 0);
    }else if(Math.abs(l2_s.y - l2_e.y) < 0.01){
      return new Point2D(l1_s.x, l2_s.y);
    }else{
      let k2 = (l2_e.y - l2_s.y) / (l2_e.x - l2_s.x);
      let x = l1_s.x;
      let y = k2 * (x - l2_e.x) + l2_e.y;
      return new Point2D(x, y);
    }
  }else if(Math.abs(l1_s.y - l1_e.y) < 0.01){
    if(Math.abs(l2_s.x - l2_e.x) < 0.01){
      return new Point2D(l2_s.x, l1_s.y);
    }else if(Math.abs(l2_s.y - l2_e.y) < 0.01){
      return new Point2D(0, 0);
    }else{
      let k2 = (l2_e.y - l2_s.y) / (l2_e.x - l2_s.x);
      let y = l1_s.y;
      let x = (y - l2_e.y) / k2 + l2_e.x;
      return new Point2D(x, y);
    }
  }else{
    if(Math.abs(l2_s.x - l2_e.x) < 0.01){
      let k1 = (l1_e.y - l1_s.y) / (l1_e.x - l1_s.x);
      let x = l2_s.x;
      let y = k1 * (x - l1_e.x) + l1_e.y;
      return new Point2D(x, y);
    }else if(Math.abs(l2_s.y - l2_e.y) < 0.01){
      let k1 = (l1_e.y - l1_s.y) / (l1_e.x - l1_s.x);
      let y = l2_s.y;
      let x = (y - l1_e.y) / k1 + l1_e.x;
      return new Point2D(x, y);
    }else{
      let k1 = (l1_e.y - l1_s.y) / (l1_e.x - l1_s.x);
      let k2 = (l2_e.y - l2_s.y) / (l2_e.x - l2_s.x);
      let x = (l2_s.y - l1_s.y + k1 * l1_s.x - k2 * l2_s.x) / (k1 - k2);
      let y = k1 * (x - l1_s.x) + l1_s.y;
      return new Point2D(x, y);
    }
  }
};
// --------------------------------------------------------------------------------
Line2D.prototype.getProjectionPoint = function(point){
  let start = this._start;
  let end = this._end;
  if(Math.abs(start.x - end.x) < 0.01){
    return new Point2D(start.x, point.y);
  }else if(Math.abs(start.y - end.y) < 0.01){
    return new Point2D(point.x, start.y);
  }else{
    let k1 = (end.y - start.y) / (end.x - start.x);
    let k2 = -1 / k1;
    let x = (k2 * point.x - point.y + end.y - k1 * end.x) / (k2 - k1);
    let y = k2 * (x - point.x) + point.y;
    return new Point2D(x, y);
  }
};
Line2D.prototype.getDependent = function(point){
  let start = this._start;
  let end = this._end;
  if(Math.abs(start.x - end.x) < 0.01){
    return (point.y - start.y) / (end.y - start.y);
  }else if(Math.abs(start.y - end.y) < 0.01){
    return (point.x - start.x) / (end.x - start.x);
  }else{
    let k1 = (end.y - start.y) / (end.x - start.x);
    let k2 = -1 / k1;
    let x = (k2 * point.x - point.y + end.y - k1 * end.x) / (k2 - k1);
    return (x - start.x) / (end.x - start.x);
  }
};
Line2D.prototype.getDependentPoint = function(dependent){
  let start = this._start;
  let end = this._end;
  let x = start.x + (end.x - start.x) * dependent;
  let y = start.y + (end.y - start.y) * dependent;
  return new Point2D(x, y);
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
module.exports = Line2D;
// ================================================================================
