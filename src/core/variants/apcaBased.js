/**
 * Variant 3: APCA-Based Generator with Max Chroma
 *
 * Uses APCA contrast algorithm to generate colors with precise contrast ratios.
 * Based on Evil Martians Harmonizer approach.
 */

import { crToFg, crToBg, apcach, maxChroma as getMaxChroma } from 'apcach';
import { converter } from 'culori';
import Color from 'colorjs.io';

const toOklch = converter('oklch');

// Default APCA contrast levels based on Radix cyan scale analysis
// These are baseline contrast ratios for each of 12 steps
const DEFAULT_CONTRAST_LEVELS_LIGHT = [
  3,    // Step 1: App background
  6,    // Step 2: Subtle background
  12,   // Step 3: UI element background
  18,   // Step 4: Hovered UI element
  24,   // Step 5: Active/Selected
  30,   // Step 6: Subtle borders
  40,   // Step 7: UI element border
  50,   // Step 8: Hovered border
  60,   // Step 9: Solid backgrounds
  68,   // Step 10: Hovered solid
  75,   // Step 11: Low-contrast text
  90,   // Step 12: High-contrast text
];

const DEFAULT_CONTRAST_LEVELS_DARK = [
  -3,   // Step 1: App background (negative = lighter in dark mode)
  -6,   // Step 2: Subtle background
  -12,  // Step 3: UI element background
  -18,  // Step 4: Hovered UI element
  -24,  // Step 5: Active/Selected
  -30,  // Step 6: Subtle borders
  -40,  // Step 7: UI element border
  -50,  // Step 8: Hovered border
  -60,  // Step 9: Solid backgrounds
  -68,  // Step 10: Hovered solid
  -75,  // Step 11: Low-contrast text
  -90,  // Step 12: High-contrast text
];

/**
 * Generate color scale using APCA contrast
 * @param {number} targetHue - Target hue (0-360)
 * @param {string} appearance - 'light' or 'dark'
 * @param {string} background - Background color (HEX)
 * @param {Array<number>} [absoluteContrastLevels] - Absolute contrast levels for each step
 * @param {number} [chromaCap] - Optional chroma cap (0-100)
 * @param {boolean} [isNeutral] - Whether this is a neutral color (uses lower chroma)
 * @param {boolean} [maxChroma] - Whether to use maximum chroma
 * @param {boolean} [lockColor] - Whether to lock step 9 to algorithm
 * @param {string} [userColor] - User's selected color (for brand, to override step 9)
 * @returns {Object} Color scale with solid and alpha versions
 */
export function generateAPCABased({
  targetHue,
  appearance,
  background,
  absoluteContrastLevels = null,
  chromaCap = null,
  isNeutral = false,
  maxChroma = false,
  lockColor = true,
  userColor = null,
}) {
  const isLight = appearance === 'light';
  const baseContrastLevels = isLight
    ? DEFAULT_CONTRAST_LEVELS_LIGHT
    : DEFAULT_CONTRAST_LEVELS_DARK;

  // Use absolute contrast levels if provided, otherwise use defaults
  const contrastLevels = absoluteContrastLevels || baseContrastLevels;

  const bgMode = isLight ? 'light' : 'dark';
  const searchDirection = bgMode === 'dark' ? 'lighter' : 'darker';

  // Calculate chroma based on settings
  let chroma;
  if (isNeutral) {
    // For neutral colors, use very low chroma
    chroma = 0.02;
  } else if (maxChroma) {
    // Use maximum available chroma
    chroma = getMaxChroma();
  } else if (chromaCap !== null) {
    // Use specified chroma cap
    chroma = getMaxChroma(chromaCap);
  } else {
    // Use default reasonable chroma
    chroma = 0.15; // Default chroma for good saturation
  }

  // Generate each color step
  const scaleOKLCH = contrastLevels.map((contrastLevel, index) => {
    return calculateColorWithAPCA({
      background,
      contrastLevel,
      hue: targetHue,
      chroma,
      searchDirection,
    });
  });

  // If lockColor is false and we have a userColor, replace step 9 (index 8)
  if (!lockColor && userColor) {
    const userColorObj = new Color(userColor).to('oklch');
    scaleOKLCH[8] = {
      l: userColorObj.coords[0],
      c: userColorObj.coords[1],
      h: userColorObj.coords[2] || targetHue,
    };
  }

  // Convert to various formats
  const scale = scaleOKLCH.map(color => {
    const colorObj = new Color('oklch', [color.l, color.c, color.h]);
    return colorObj;
  });

  const scaleHex = scale.map(color =>
    color.to('srgb').toString({ format: 'hex' })
  );

  const scaleWideGamut = scale.map(color => {
    const L = +(color.coords[0] * 100).toFixed(1);
    return color
      .to('oklch')
      .toString({ precision: 4 })
      .replace(/(\S+)(.+)/, `oklch(${L}%$2`);
  });

  // Generate alpha versions
  const backgroundColor = new Color(background).to('srgb');
  const backgroundHex = backgroundColor.toString({ format: 'hex' });

  const scaleAlphaHex = scaleHex.map(color =>
    getAlphaColorSrgb(color, backgroundHex)
  );

  const scaleAlphaWideGamut = scaleHex.map(color =>
    getAlphaColorP3(color, backgroundHex)
  );

  return {
    scale: scaleHex,
    scaleAlpha: scaleAlphaHex,
    scaleWideGamut: scaleWideGamut,
    scaleAlphaWideGamut: scaleAlphaWideGamut,
    contrastLevels, // Return actual contrast levels used
  };
}

/**
 * Calculate color with specific APCA contrast
 */
function calculateColorWithAPCA({
  background,
  contrastLevel,
  hue,
  chroma,
  searchDirection,
}) {
  // Determine method based on search direction
  const method = searchDirection === 'lighter' ? crToFg : crToBg;

  // Get color with target contrast using APCA
  // apcach returns color in format { lightness, chroma, hue }
  const result = method(background, contrastLevel, 'apca', searchDirection);

  // Now apply hue and chroma using apcach
  const apcachResult = apcach(result, chroma, hue, 100, 'srgb');

  return {
    l: apcachResult.lightness,
    c: apcachResult.chroma,
    h: hue,
  };
}

/**
 * Get max chroma for a specific hue at given lightness
 */
export function getMaxChromaForHue(lightness, hue) {
  // Create test color
  const testColor = new Color('oklch', [lightness, 0.4, hue]); // Start with high chroma

  // Check if in gamut
  const srgb = testColor.to('srgb');

  // Binary search for max chroma
  let minC = 0;
  let maxC = 0.4;
  let iterations = 20;

  while (iterations > 0) {
    const midC = (minC + maxC) / 2;
    const color = new Color('oklch', [lightness, midC, hue]);
    const rgb = color.to('srgb');

    // Check if all RGB values are in gamut (0-1)
    const inGamut =
      rgb.coords[0] >= 0 && rgb.coords[0] <= 1 &&
      rgb.coords[1] >= 0 && rgb.coords[1] <= 1 &&
      rgb.coords[2] >= 0 && rgb.coords[2] <= 1;

    if (inGamut) {
      minC = midC;
    } else {
      maxC = midC;
    }

    iterations--;
  }

  return minC;
}

/**
 * Get alpha color (transparent) that looks the same when overlaid on background
 */
function getAlphaColor(targetRgb, backgroundRgb, rgbPrecision, alphaPrecision, targetAlpha) {
  const [tr, tg, tb] = targetRgb.map((c) => Math.round(c * rgbPrecision));
  const [br, bg, bb] = backgroundRgb.map((c) => Math.round(c * rgbPrecision));

  let desiredRgb = 0;
  if (tr > br || tg > bg || tb > bb) {
    desiredRgb = rgbPrecision;
  }

  const alphaR = (tr - br) / (desiredRgb - br);
  const alphaG = (tg - bg) / (desiredRgb - bg);
  const alphaB = (tb - bb) / (desiredRgb - bb);

  const isPureGray = [alphaR, alphaG, alphaB].every(
    (alpha) => alpha === alphaR,
  );

  if (!targetAlpha && isPureGray) {
    const V = desiredRgb / rgbPrecision;
    return [V, V, V, alphaR];
  }

  const clampRgb = (n) =>
    isNaN(n) ? 0 : Math.min(rgbPrecision, Math.max(0, n));
  const clampA = (n) =>
    isNaN(n) ? 0 : Math.min(alphaPrecision, Math.max(0, n));
  const maxAlpha = targetAlpha ?? Math.max(alphaR, alphaG, alphaB);

  const A = clampA(Math.ceil(maxAlpha * alphaPrecision)) / alphaPrecision;
  let R = clampRgb(((br * (1 - A) - tr) / A) * -1);
  let G = clampRgb(((bg * (1 - A) - tg) / A) * -1);
  let B = clampRgb(((bb * (1 - A) - tb) / A) * -1);

  R = Math.ceil(R);
  G = Math.ceil(G);
  B = Math.ceil(B);

  const blendAlpha = (foreground, alpha, background) =>
    Math.round(background * (1 - alpha)) + Math.round(foreground * alpha);

  const blendedR = blendAlpha(R, A, br);
  const blendedG = blendAlpha(G, A, bg);
  const blendedB = blendAlpha(B, A, bb);

  if (desiredRgb === 0) {
    if (tr <= br && tr !== blendedR) R = tr > blendedR ? R + 1 : R - 1;
    if (tg <= bg && tg !== blendedG) G = tg > blendedG ? G + 1 : G - 1;
    if (tb <= bb && tb !== blendedB) B = tb > blendedB ? B + 1 : B - 1;
  }

  if (desiredRgb === rgbPrecision) {
    if (tr >= br && tr !== blendedR) R = tr > blendedR ? R + 1 : R - 1;
    if (tg >= bg && tg !== blendedG) G = tg > blendedG ? G + 1 : G - 1;
    if (tb >= bb && tb !== blendedB) B = tb > blendedB ? B + 1 : B - 1;
  }

  R = R / rgbPrecision;
  G = G / rgbPrecision;
  B = B / rgbPrecision;

  return [R, G, B, A];
}

function getAlphaColorSrgb(targetColor, backgroundColor, targetAlpha) {
  const [r, g, b, a] = getAlphaColor(
    new Color(targetColor).to('srgb').coords,
    new Color(backgroundColor).to('srgb').coords,
    255,
    255,
    targetAlpha,
  );

  const color = new Color('srgb', [r, g, b], a);
  let hex = color.toString({ format: 'hex' });

  if (hex.length === 4) {
    const hash = hex.charAt(0);
    const r = hex.charAt(1);
    const g = hex.charAt(2);
    const b = hex.charAt(3);
    hex = hash + r + r + g + g + b + b;
  }
  if (hex.length === 5) {
    const hash = hex.charAt(0);
    const r = hex.charAt(1);
    const g = hex.charAt(2);
    const b = hex.charAt(3);
    const a = hex.charAt(4);
    hex = hash + r + r + g + g + b + b + a + a;
  }

  return hex;
}

function getAlphaColorP3(targetColor, backgroundColor, targetAlpha) {
  const [r, g, b, a] = getAlphaColor(
    new Color(targetColor).to('p3').coords,
    new Color(backgroundColor).to('p3').coords,
    255,
    1000,
    targetAlpha,
  );

  return (
    new Color('p3', [r, g, b], a)
      .toString({ precision: 4 })
      .replace('color(p3 ', 'color(display-p3 ')
  );
}

// Export default contrast levels for UI configuration
export const DEFAULT_CONTRAST_LEVELS = {
  light: DEFAULT_CONTRAST_LEVELS_LIGHT,
  dark: DEFAULT_CONTRAST_LEVELS_DARK,
};
