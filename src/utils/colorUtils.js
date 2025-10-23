/**
 * Color utilities for converting between formats
 */

import convert from 'color-convert';

/**
 * Convert HEX to HSL
 * @param {string} hex - HEX color (e.g., "#3D63DD")
 * @returns {[number, number, number]} - [h, s, l]
 */
export function hexToHSL(hex) {
  const cleanHex = hex.replace('#', '');
  return convert.hex.hsl(cleanHex);
}

/**
 * Convert HSL to HEX
 * @param {number} h - Hue (0-360)
 * @param {number} s - Saturation (0-100)
 * @param {number} l - Lightness (0-100)
 * @returns {string} - HEX color with #
 */
export function hslToHex(h, s, l) {
  return '#' + convert.hsl.hex(h, s, l);
}

/**
 * Clamp a value between min and max
 * @param {number} value
 * @param {number} min
 * @param {number} max
 * @returns {number}
 */
export function clamp(value, min, max) {
  return Math.min(Math.max(value, min), max);
}

/**
 * Validate HEX color format
 * @param {string} hex
 * @returns {boolean}
 */
export function isValidHex(hex) {
  return /^#?([A-Fa-f0-9]{6}|[A-Fa-f0-9]{3})$/.test(hex);
}
