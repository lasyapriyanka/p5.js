/**
 * @module Color
 * @submodule Creating & Reading
 * @for p5
 * @requires core
 */
define(function (require) {

  'use strict';

  var p5 = require('core');
  var constants = require('constants');

  /**
   * Extracts the alpha value from a color.
   * 
   * @method alpha
   * @param {Object} color any value of the color datatype
   * @example
   * <div>
   * <code>
   * noStroke();
   * c = color(0, 126, 255, 102);
   * fill(c);
   * rect(15, 15, 35, 70);
   * value = alpha(c);  // Sets 'value' to 102
   * fill(value);
   * rect(50, 15, 35, 70);
   * </code>
   * </div>
   */
  p5.prototype.alpha = function(c) {
    if (!c.isColor) {
      c = this.color(c);
    }
    return c.rgba[3];
  };

  /**
   * Extracts the blue value from a color, scaled to match current colorMode(). 
   * 
   * @method blue
   * @param {Object} color any value of the color datatype
   * @example
   * <div>
   * <code>
   * c = color(175, 100, 220);  // Define color 'c'
   * fill(c);  // Use color variable 'c' as fill color
   * rect(15, 20, 35, 60);  // Draw left rectangle
   * 
   * blueValue = blue(c);  // Get blue in 'c'
   * println(blueValue);  // Prints "220.0"
   * fill(0, 0, blueValue);  // Use 'blueValue' in new fill
   * rect(50, 20, 35, 60);  // Draw right rectangle   
   * </code>
   * </div>
   */
  p5.prototype.blue = function(c) {
    if (!c.isColor) {
      c = this.color(c);
    }
    return c.rgba[2];
  };

  /**
   * Extracts the brightness value from a color. 
   * 
   * @method brightness
   * @param {Object} color any value of the color datatype
   * @example
   * <div>
   * <code>
   * noStroke();
   * colorMode(HSB, 255);
   * c = color(0, 126, 255);
   * fill(c);
   * rect(15, 20, 35, 60);
   * value = brightness(c);  // Sets 'value' to 255
   * fill(value);
   * rect(50, 20, 35, 60);
   * </code>
   * </div>
   */
  p5.prototype.brightness = function(c) {
    if (!c.isColor) {
      c = this.color(c);
    }
    if (!c.hsba) {
      c.hsba = rgb2hsv(c.rgba[0], c.rgba[1], c.rgba[2]).concat(c.rgba[3]);
    }
    return c.hsba[2];
  };

  /**
   * Creates colors for storing in variables of the color datatype. The
   * parameters are interpreted as RGB or HSB values depending on the
   * current colorMode(). The default mode is RGB values from 0 to 255
   * and, therefore, the function call color(255, 204, 0) will return a
   * bright yellow color.
   * 
   * Note that if only one value is provided to color(), it will be interpreted
   * as a grayscale value. Add a second value, and it will be used for alpha
   * transparency. When three values are specified, they are interpreted as
   * either RGB or HSB values. Adding a fourth value applies alpha
   * transparency.
   * 
   * Colors are stored as Numbers or Arrays.
   * 
   * @method color
   * @param  {Number} v1      gray value or red or hue value relative to the 
   *                          current color range
   * @param  {Number} [v2]    gray value or green or saturation value relative
   *                          to the current color range (or alpha value if
   *                          first param is gray value)
   * @param  {Number} [v3]    gray value or blue or brightness value relative
   *                          to the current color range
   * @param  {Number} [alpha] alpha value relative to current color range
   * @return {Array}          resulting color
   * @example
   * <div>
   * <code>
   * c = color(255, 204, 0);  // Define color 'c'
   * fill(c);  // Use color variable 'c' as fill color
   * noStroke();  // Don't draw a stroke around shapes
   * rect(30, 20, 55, 55);  // Draw rectangle
   * </code>
   * </div>
   *
   * <div>
   * <code>
   * c = color(255, 204, 0);  // Define color 'c'
   * fill(c);  // Use color variable 'c' as fill color
   * noStroke();  // Don't draw a stroke around shapes
   * ellipse(25, 25, 80, 80);  // Draw left circle
   * 
   * // Using only one value with color()
   * // generates a grayscale value.
   * c = color(65);  // Update 'c' with grayscale value
   * fill(c);  // Use updated 'c' as fill color
   * ellipse(75, 75, 80, 80);  // Draw right circle
   * </code>
   * </div>
   *
   * <div>
   * <code>
   * noStroke();  // Don't draw a stroke around shapes
   * 
   * // if switching from RGB to HSB both modes must be declared
   * colorMode(RGB, 255);  // Use RGB with scale of 0-255
   * c = color(50, 55, 100);  // Create a color for 'c'
   * fill(c);  // Use color variable 'c' as fill color
   * rect(0, 10, 45, 80);  // Draw left rect
   * 
   * colorMode(HSB, 100);  // Use HSB with scale of 0-100
   * c = color(50, 55, 100);  // Update 'c' with new color
   * fill(c);  // Use updated 'c' as fill color
   * rect(55, 10, 45, 80);  // Draw right rect
   * </code>
   * </div>
   */
  p5.prototype.color = function() {

    var c = {};
    c.isColor = true;

    var args = arguments;
    
    var isRGB = this._colorMode === constants.RGB;
    var maxArr = isRGB ? this._maxRGB : this._maxHSB;

    var r, g, b, a;
    if (args.length >= 3) {
      r = args[0];
      g = args[1];
      b = args[2];
      a = typeof args[3] === 'number' ? args[3] : maxArr[3];
    } else {
      if (isRGB) {
        r = g = b = args[0];
      } else {
        r = b = args[0];
        g = 0;
      }
      a = typeof args[1] === 'number' ? args[1] : maxArr[3];
    }
    // we will need all these later, store them instead of recalc
    if (!isRGB) {
      c.hsba = [r, g, b, a];
    }
    c.rgba = this.getNormalizedColor([r, g, b, a]);
    c.colorString = this.getColorString(c.rgba);
    return c;
  };

  /**
   * Extracts the green value from a color, scaled to match current
   * colorMode(). 
   * 
   * @method green
   * @param {Object} color any value of the color datatype
   * @example
   * <div>
   * <code>
   * c = color(20, 75, 200);  // Define color 'c'
   * fill(c);  // Use color variable 'c' as fill color
   * rect(15, 20, 35, 60);  // Draw left rectangle
   * 
   * greenValue = green(c);  // Get green in 'c'
   * println(greenValue);  // Print "75.0"
   * fill(0, greenValue, 0);  // Use 'greenValue' in new fill
   * rect(50, 20, 35, 60);  // Draw right rectangle
   * </code>
   * </div>
   */
  p5.prototype.green = function(c) {
    if (!c.isColor) {
      c = this.color(c);
    }
    return c.rgba[1];
  };

  /**
   * Extracts the hue value from a color. 
   * 
   * @method hue
   * @param {Object} color any value of the color datatype
   * @example
   * <div>
   * <code>
   * noStroke();
   * colorMode(HSB, 255);
   * c = color(0, 126, 255);
   * fill(c);
   * rect(15, 20, 35, 60);
   * value = hue(c);  // Sets 'value' to "0"
   * fill(value);
   * rect(50, 20, 35, 60);
   * </code>
   * </div>
   */
  p5.prototype.hue = function(c) {
    if (!c.isColor) {
      c = this.color(c);
    }
    if (!c.hsba) {
      c.hsba = rgb2hsv(c.rgba[0], c.rgba[1], c.rgba[2]).concat(c.rgba[3]);
    }
    return c.hsba[0];
  };

  /**
   * Calculates a color or colors between two color at a specific increment.
   * The amt parameter is the amount to interpolate between the two values
   * where 0.0 equal to the first point, 0.1 is very near the first point,
   * 0.5 is halfway in between, etc. An amount below 0 will be treated as 0.
   * Likewise, amounts above 1 will be capped at 1. This is different from
   * the behavior of lerp(), but necessary because otherwise numbers outside
   * the range will produce strange and unexpected colors.
   * 
   * @method lerpColor
   * @param  {Array/Number} c1  interpolate from this color
   * @param  {Array/Number} c2  interpolate to this color
   * @param  {Number}       amt number between 0 and 1
   * @return {Array/Number}     interpolated color
   * @example
   * <div>
   * <code>
   * stroke(255);
   * background(51);
   * from = color(204, 102, 0);
   * to = color(0, 102, 153);
   * interA = lerpColor(from, to, .33);
   * interB = lerpColor(from, to, .66);
   * fill(from);
   * rect(10, 20, 20, 60);
   * fill(interA);
   * rect(30, 20, 20, 60);
   * fill(interB);
   * rect(50, 20, 20, 60);
   * fill(to);
   * rect(70, 20, 20, 60);
   * </code>
   * </div>
   */
  p5.prototype.lerpColor = function(c1, c2, amt) {
    if (typeof c1 === 'object') {
      var c = [];
      for (var i=0; i<c1.length; i++) {
        c.push(p5.prototype.lerp(c1[i], c2[i], amt));
      }
      return c;
    } else {
      return p5.prototype.lerp(c1, c2, amt);
    }
  };

  /**
   * Extracts the red value from a color, scaled to match current colorMode(). 
   * 
   * @method red
   * @param {Object} color any value of the color datatype
   * @example
   * <div>
   * <code>
   * c = color(255, 204, 0);  // Define color 'c'
   * fill(c);  // Use color variable 'c' as fill color
   * rect(15, 20, 35, 60);  // Draw left rectangle
   *
   * redValue = red(c);  // Get red in 'c'
   * println(redValue);  // Print "255.0"
   * fill(redValue, 0, 0);  // Use 'redValue' in new fill
   * rect(50, 20, 35, 60);  // Draw right rectangle
   * </code>
   * </div>
   */
  p5.prototype.red = function(c) {
    if (!c.isColor) {
      c = this.color(c);
    }
    return c.rgba[0];
  };

  /**
   * Extracts the saturation value from a color. 
   * 
   * @method saturation
   * @param {Object} color any value of the color datatype
   * @example
   * <div>
   * <code>
   * noStroke();
   * colorMode(HSB, 255);
   * c = color(0, 126, 255);
   * fill(c);
   * rect(15, 20, 35, 60);
   * value = saturation(c);  // Sets 'value' to 126
   * fill(value);
   * rect(50, 20, 35, 60);
   * </code>
   * </div>
   */
  p5.prototype.saturation = function(c) {
    if (!c.isColor) {
      c = this.color(c);
    }
    if (!c.hsba) {
      c.hsba = rgb2hsv(c.rgba[0], c.rgba[1], c.rgba[2]).concat(c.rgba[3]);
    }
    return c.hsba[1];
  };


  function rgb2hsv(r,g,b) {
    var var_R = r/255;                           //RGB from 0 to 255
    var var_G = g/255;
    var var_B = b/255;

    var var_Min = Math.min(var_R, var_G, var_B); //Min. value of RGB
    var var_Max = Math.max(var_R, var_G, var_B); //Max. value of RGB
    var del_Max = var_Max - var_Min;             //Delta RGB value 

    var H;
    var S;
    var V = var_Max;

    if (del_Max === 0) { //This is a gray, no chroma...
      H = 0; //HSV results from 0 to 1
      S = 0;
    }
    else { //Chromatic data...
      S = del_Max/var_Max;

      var del_R = ( ( ( var_Max - var_R ) / 6 ) + ( del_Max / 2 ) ) / del_Max;
      var del_G = ( ( ( var_Max - var_G ) / 6 ) + ( del_Max / 2 ) ) / del_Max;
      var del_B = ( ( ( var_Max - var_B ) / 6 ) + ( del_Max / 2 ) ) / del_Max;

      if (var_R === var_Max) {
        H = del_B - del_G;
      } else if (var_G === var_Max) {
        H = 1/3 + del_R - del_B;
      } else if (var_B === var_Max) {
        H = 2/3 + del_G - del_R;
      }

      if (H<0) {
        H += 1;
      }
      if (H>1) {
        H -= 1;
      }
    }
    return [
        Math.round(H * 255),
        Math.round(S * 255),
        Math.round(V * 255)
      ];
  }

  return p5;

});
