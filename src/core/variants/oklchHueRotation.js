/**
 * Variant 2: OKLCH Hue Rotation Generator
 *
 * Uses Radix cyan as base palette, converts to OKLCH and rotates hue.
 * Provides stable Lightness and Chroma across all hues.
 */

import Color from 'colorjs.io';

// Base cyan palette from Radix Colors (P3 colorspace)
const CYAN_BASE_LIGHT = [
  'color(display-p3 0.982 0.992 0.996)',
  'color(display-p3 0.955 0.981 0.984)',
  'color(display-p3 0.888 0.965 0.975)',
  'color(display-p3 0.821 0.941 0.959)',
  'color(display-p3 0.751 0.907 0.935)',
  'color(display-p3 0.671 0.862 0.9)',
  'color(display-p3 0.564 0.8 0.854)',
  'color(display-p3 0.388 0.715 0.798)',
  'color(display-p3 0.282 0.627 0.765)',
  'color(display-p3 0.264 0.583 0.71)',
  'color(display-p3 0.08 0.48 0.63)',
  'color(display-p3 0.108 0.232 0.277)',
];

const CYAN_BASE_DARK = [
  'color(display-p3 0.053 0.085 0.098)',
  'color(display-p3 0.072 0.105 0.122)',
  'color(display-p3 0.073 0.168 0.209)',
  'color(display-p3 0.063 0.216 0.277)',
  'color(display-p3 0.091 0.267 0.336)',
  'color(display-p3 0.137 0.324 0.4)',
  'color(display-p3 0.186 0.398 0.484)',
  'color(display-p3 0.23 0.496 0.6)',
  'color(display-p3 0.282 0.627 0.765)',
  'color(display-p3 0.331 0.675 0.801)',
  'color(display-p3 0.446 0.79 0.887)',
  'color(display-p3 0.757 0.919 0.962)',
];

// Mauve palette for neutral colors (less saturated)
const MAUVE_BASE_LIGHT = [
  'color(display-p3 0.991 0.988 0.992)',
  'color(display-p3 0.98 0.976 0.984)',
  'color(display-p3 0.946 0.938 0.952)',
  'color(display-p3 0.915 0.906 0.925)',
  'color(display-p3 0.886 0.876 0.901)',
  'color(display-p3 0.856 0.846 0.875)',
  'color(display-p3 0.814 0.804 0.84)',
  'color(display-p3 0.735 0.728 0.777)',
  'color(display-p3 0.555 0.549 0.596)',
  'color(display-p3 0.514 0.508 0.552)',
  'color(display-p3 0.395 0.388 0.424)',
  'color(display-p3 0.128 0.122 0.147)',
];

const MAUVE_BASE_DARK = [
  'color(display-p3 0.07 0.067 0.074)',
  'color(display-p3 0.101 0.098 0.105)',
  'color(display-p3 0.138 0.134 0.144)',
  'color(display-p3 0.167 0.161 0.175)',
  'color(display-p3 0.196 0.189 0.206)',
  'color(display-p3 0.232 0.225 0.245)',
  'color(display-p3 0.286 0.277 0.302)',
  'color(display-p3 0.383 0.373 0.408)',
  'color(display-p3 0.434 0.428 0.467)',
  'color(display-p3 0.487 0.48 0.519)',
  'color(display-p3 0.707 0.7 0.735)',
  'color(display-p3 0.933 0.933 0.94)',
];

/**
 * Convert base cyan palette to OKLCH
 */
function getCyanBaseOKLCH(appearance) {
  const baseColors = appearance === 'light' ? CYAN_BASE_LIGHT : CYAN_BASE_DARK;

  return baseColors.map(colorStr => {
    const color = new Color(colorStr).to('oklch');
    return {
      l: color.coords[0],
      c: color.coords[1],
      h: color.coords[2] || 0,
    };
  });
}

/**
 * Convert base mauve palette to OKLCH (for neutral colors)
 */
function getMauveBaseOKLCH(appearance) {
  const baseColors = appearance === 'light' ? MAUVE_BASE_LIGHT : MAUVE_BASE_DARK;

  return baseColors.map(colorStr => {
    const color = new Color(colorStr).to('oklch');
    return {
      l: color.coords[0],
      c: color.coords[1],
      h: color.coords[2] || 0,
    };
  });
}

/**
 * Calculate max chroma for given lightness and hue
 */
function getMaxChroma(lightness, hue) {
  let minC = 0;
  let maxC = 0.4;
  let iterations = 20;

  while (iterations > 0) {
    const midC = (minC + maxC) / 2;
    const color = new Color('oklch', [lightness, midC, hue]);
    const rgb = color.to('srgb');

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
 * Generate color scale by rotating hue
 * @param {number} targetHue - Target hue (0-360)
 * @param {string} appearance - 'light' or 'dark'
 * @param {string} background - Background color (HEX)
 * @param {boolean} isNeutral - Whether this is a neutral color (uses mauve base)
 * @param {boolean} maxChroma - Whether to use maximum chroma
 * @param {boolean} lockColor - Whether to lock step 9 to base scale
 * @param {string} userColor - User's selected color (for brand, to override step 9)
 * @returns {Object} Color scale with solid and alpha versions
 */
export function generateOKLCHHueRotation({ targetHue, appearance, background, isNeutral = false, maxChroma = false, lockColor = true, userColor = null }) {
  const baseOKLCH = isNeutral ? getMauveBaseOKLCH(appearance) : getCyanBaseOKLCH(appearance);

  // Generate scale by replacing hue
  const scale = baseOKLCH.map(({ l, c, h }, index) => {
    let chroma = c;

    // If maxChroma is enabled, calculate max chroma for this lightness and hue
    if (maxChroma) {
      const maxC = getMaxChroma(l, targetHue);
      chroma = maxC;
    }

    // Use target hue instead of base hue
    const color = new Color('oklch', [l, chroma, targetHue]);
    return color;
  });

  // If lockColor is false and we have a userColor, replace step 9 (index 8)
  if (!lockColor && userColor) {
    const userColorObj = new Color(userColor).to('oklch');
    scale[8] = userColorObj;
  }

  // Convert to HEX (sRGB)
  const scaleHex = scale.map(color =>
    color.to('srgb').toString({ format: 'hex' })
  );

  // Convert to OKLCH string (wide gamut)
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
  };
}

/**
 * Get alpha color (transparent) that looks the same when overlaid on background
 * Based on Radix Colors algorithm
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

  // Format shortform hex to longform
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
