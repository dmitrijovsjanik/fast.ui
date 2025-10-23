/**
 * Color derivation based on A Nice Red algorithm
 * Automatically derives semantic colors from a brand color
 */

import { hexToHSL, hslToHex, clamp } from '../utils/colorUtils.js';

/**
 * Derive Success (Green) color from brand color
 * @param {[number, number, number]} brandHSL - [h, s, l]
 * @returns {string} HEX color
 */
export function deriveSuccess(brandHSL) {
  const [primaryH, primaryS, primaryL] = brandHSL;

  // Determine green hue based on primary hue
  let greenH;
  switch (true) {
    case (primaryH < 25 || primaryH >= 335):
      greenH = 120;
      break;
    case (primaryH >= 25 && primaryH < 75):
      greenH = 80;
      break;
    case (primaryH >= 150 && primaryH < 210):
      greenH = 90;
      break;
    case (primaryH >= 210 && primaryH < 285):
      greenH = 100;
      break;
    case (primaryH >= 285 && primaryH < 335):
      greenH = 130;
      break;
    default:
      greenH = primaryH;
      break;
  }

  // Adjust saturation: primaryS - 5, clamped to 55-70
  const greenS = clamp(primaryS - 5, 55, 70);

  // Adjust lightness: primaryL + 5, clamped to 45-60
  const greenL = clamp(primaryL + 5, 45, 60);

  return hslToHex(greenH, greenS, greenL);
}

/**
 * Derive Warning (Amber) color from brand color
 * @param {[number, number, number]} brandHSL - [h, s, l]
 * @returns {string} HEX color
 */
export function deriveWarning(brandHSL) {
  const [primaryH, primaryS, primaryL] = brandHSL;

  // Determine amber hue based on primary hue
  let amberH;
  switch (true) {
    case (primaryH >= 240 || primaryH < 60): // Red
      amberH = 42;
      break;
    case (primaryH >= 60 && primaryH < 140): // Green
      amberH = 40;
      break;
    case (primaryH >= 140 && primaryH < 240): // Cyan
      amberH = 38;
      break;
    default:
      amberH = primaryH;
      break;
  }

  // Adjust saturation: primaryS + 5, clamped to 80-100
  const amberS = clamp(primaryS + 5, 80, 100);

  // Adjust lightness: primaryL + 15, clamped to 55-65
  const amberL = clamp(primaryL + 15, 55, 65);

  return hslToHex(amberH, amberS, amberL);
}

/**
 * Derive Error (Red) color from brand color
 * @param {[number, number, number]} brandHSL - [h, s, l]
 * @returns {string} HEX color
 */
export function deriveError(brandHSL) {
  const [primaryH, primaryS, primaryL] = brandHSL;

  // Determine red hue based on primary hue
  let redH;
  switch (true) {
    case (primaryH >= 15 && primaryH < 60): // Yellow
      redH = 5;
      break;
    case (primaryH >= 60 && primaryH < 140): // Green
      redH = 10;
      break;
    case (primaryH >= 140 && primaryH < 190): // Cyan
      redH = 357;
      break;
    case (primaryH >= 190 && primaryH < 240): // Blue
      redH = 0;
      break;
    case (primaryH >= 240 && primaryH < 350): // Purple
      redH = 355;
      break;
    default:
      redH = primaryH;
      break;
  }

  // Saturation clamped to 75-85
  const redS = clamp(primaryS, 75, 85);

  // Adjust lightness: primaryL + 5, clamped to 45-55
  const redL = clamp(primaryL + 5, 45, 55);

  return hslToHex(redH, redS, redL);
}

/**
 * Derive Neutral (Gray) color from brand color
 * @param {[number, number, number]} brandHSL - [h, s, l]
 * @returns {string} HEX color
 */
export function deriveNeutral(brandHSL) {
  const [primaryH] = brandHSL;

  // Determine gray hue based on primary hue
  let grayH;
  switch (true) {
    case (primaryH < 40 || primaryH >= 160):
      grayH = 200;
      break;
    case (primaryH >= 40 && primaryH < 100):
      grayH = 220;
      break;
    case (primaryH >= 100 && primaryH < 160):
      grayH = 210;
      break;
    default:
      grayH = 200;
      break;
  }

  // Fixed saturation and lightness for neutrals
  const grayS = 15;
  const grayL = 30;

  return hslToHex(grayH, grayS, grayL);
}

/**
 * Derive all semantic colors from a brand color
 * @param {string} brandColor - HEX color
 * @returns {object} Object with all derived colors
 */
export function deriveSemanticColors(brandColor) {
  const brandHSL = hexToHSL(brandColor);

  return {
    brand: brandColor,
    success: deriveSuccess(brandHSL),
    warning: deriveWarning(brandHSL),
    error: deriveError(brandHSL),
    neutral: deriveNeutral(brandHSL)
  };
}
