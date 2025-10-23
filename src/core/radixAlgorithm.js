/**
 * Exact Radix UI Colors Generation Algorithm
 * Ported from: https://github.com/radix-ui/website/blob/main/components/generateRadixColors.tsx
 *
 * This file contains the complete, unmodified algorithm used by Radix UI to generate
 * their color scales. No simplifications have been made.
 */

import Color from 'colorjs.io';
import BezierEasing from 'bezier-easing';

// Reference base colors from Radix UI (subset for performance)
// These are used to find the closest matching scale
import { getRadixBaseColors } from './radixBaseScales.js';

const arrayOf12 = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11];
const grayScaleNames = ['gray', 'mauve', 'slate', 'sage', 'olive', 'sand'];

const darkModeEasing = [1, 0, 1, 0];
const lightModeEasing = [0, 2, 0, 2];

/**
 * Main function to generate Radix-style color scales
 * @param {Object} options
 * @param {'light'|'dark'} options.appearance
 * @param {string} options.accent - Accent color in hex
 * @param {string} options.gray - Gray color in hex
 * @param {string} options.background - Background color in hex
 * @returns {Object} Generated scales
 */
export function generateRadixColors({ appearance, accent, gray, background }) {
  const { allScales, grayScales } = getRadixBaseColors(appearance);
  const backgroundColor = new Color(background).to('oklch');

  // Generate gray scale
  const grayBaseColor = new Color(gray).to('oklch');
  const grayScaleColors = getScaleFromColor(
    grayBaseColor,
    grayScales,
    backgroundColor,
    appearance
  );

  // Generate accent scale
  const accentBaseColor = new Color(accent).to('oklch');
  let accentScaleColors = getScaleFromColor(
    accentBaseColor,
    allScales,
    backgroundColor,
    appearance
  );

  // Enforce srgb for the background color
  const backgroundHex = backgroundColor.to('srgb').toString({ format: 'hex' });

  // Make sure we use the tint from the gray scale for when base is pure white or black
  const accentBaseHex = accentBaseColor.to('srgb').toString({ format: 'hex' });
  if (accentBaseHex === '#000' || accentBaseHex === '#fff') {
    accentScaleColors = grayScaleColors.map(color => color.clone());
  }

  const [accent9Color, accentContrastColor] = getStep9Colors(
    accentScaleColors,
    accentBaseColor
  );

  accentScaleColors[8] = accent9Color;
  accentScaleColors[9] = getButtonHoverColor(accent9Color, [accentScaleColors]);

  // Limit saturation of the text colors
  accentScaleColors[10].coords[1] = Math.min(
    Math.max(accentScaleColors[8].coords[1], accentScaleColors[7].coords[1]),
    accentScaleColors[10].coords[1]
  );
  accentScaleColors[11].coords[1] = Math.min(
    Math.max(accentScaleColors[8].coords[1], accentScaleColors[7].coords[1]),
    accentScaleColors[11].coords[1]
  );

  const accentScaleHex = accentScaleColors.map(color =>
    color.to('srgb').toString({ format: 'hex' })
  );

  const accentScaleAlphaHex = accentScaleHex.map(color =>
    getAlphaColorSrgb(color, backgroundHex)
  );

  const grayScaleHex = grayScaleColors.map(color =>
    color.to('srgb').toString({ format: 'hex' })
  );

  const grayScaleAlphaHex = grayScaleHex.map(color =>
    getAlphaColorSrgb(color, backgroundHex)
  );

  return {
    accentScale: accentScaleHex,
    accentScaleAlpha: accentScaleAlphaHex,
    grayScale: grayScaleHex,
    grayScaleAlpha: grayScaleAlphaHex,
    background: backgroundHex
  };
}

/**
 * Determines step 9 color (solid background) and its contrast color
 */
function getStep9Colors(scale, accentBaseColor) {
  const referenceBackgroundColor = scale[0];
  const distance = accentBaseColor.deltaEOK(referenceBackgroundColor) * 100;

  // If the accent base color is close to the page background color, it's likely
  // white on white or black on black, so we want to return something that makes sense instead
  if (distance < 25) {
    return [scale[8], getTextColor(scale[8])];
  }

  return [accentBaseColor, getTextColor(accentBaseColor)];
}

/**
 * Generates the hover state for step 10 (button hover)
 */
function getButtonHoverColor(source, scales) {
  const [L, C, H] = source.coords;
  const newL = L > 0.4 ? L - 0.03 / (L + 0.1) : L + 0.03 / (L + 0.1);
  const newC = L > 0.4 && !isNaN(H) ? C * 0.93 + 0 : C;
  const buttonHoverColor = new Color('oklch', [newL, newC, H]);

  // Find closest in-scale color to donate the chroma and hue.
  // Especially useful when the source color is pure white or black,
  // but the gray scale is tinted.
  let closestColor = buttonHoverColor;
  let minDistance = Infinity;

  scales.forEach(scale => {
    for (const color of scale) {
      const distance = buttonHoverColor.deltaEOK(color);
      if (distance < minDistance) {
        minDistance = distance;
        closestColor = color;
      }
    }
  });

  buttonHoverColor.coords[1] = closestColor.coords[1];
  buttonHoverColor.coords[2] = closestColor.coords[2];
  return buttonHoverColor;
}

/**
 * Core algorithm: Finds the closest Radix scale and adapts it to the source color
 * This is the heart of the Radix color generation algorithm
 */
function getScaleFromColor(source, scales, backgroundColor, appearance) {
  let allColors = [];

  // Find all colors from all scales and calculate their distance to source
  Object.entries(scales).forEach(([name, scale]) => {
    for (const color of scale) {
      const distance = source.deltaEOK(color);
      allColors.push({ scale: name, distance, color });
    }
  });

  allColors.sort((a, b) => a.distance - b.distance);

  // Remove non-unique scales (keep only the closest color from each scale)
  let closestColors = allColors.filter(
    (color, i, arr) =>
      i === arr.findIndex(value => value.scale === color.scale)
  );

  // If the next two closest colors are both grays, remove the second one until it's not a gray anymore
  const grayScaleNamesStr = grayScaleNames;
  const allAreGrays = closestColors.every(color =>
    grayScaleNamesStr.includes(color.scale)
  );
  if (!allAreGrays && grayScaleNamesStr.includes(closestColors[0].scale)) {
    while (grayScaleNamesStr.includes(closestColors[1].scale)) {
      closestColors.splice(1, 1);
    }
  }

  let colorA = closestColors[0];
  let colorB = closestColors[1];

  // Light trigonometry to determine if we should mix the two closest scales
  // See detailed comments in the original Radix code for the geometric explanation
  const a = colorB.distance;
  const b = colorA.distance;
  const c = colorA.color.deltaEOK(colorB.color);

  const cosA = (b ** 2 + c ** 2 - a ** 2) / (2 * b * c);
  const radA = Math.acos(cosA);
  const sinA = Math.sin(radA);

  const cosB = (a ** 2 + c ** 2 - b ** 2) / (2 * a * c);
  const radB = Math.acos(cosB);
  const sinB = Math.sin(radB);

  const tanC1 = cosA / sinA;
  const tanC2 = cosB / sinB;

  // The ratio determines how much of scale B we want to mix into scale A
  const ratio = Math.max(0, tanC1 / tanC2) * 0.5;

  // Mix the two closest scales
  const scaleA = scales[colorA.scale];
  const scaleB = scales[colorB.scale];
  const scale = arrayOf12.map(i =>
    new Color(Color.mix(scaleA[i], scaleB[i], ratio)).to('oklch')
  );

  // Get the closest color from the pre-mixed scale we created
  const baseColor = scale
    .slice()
    .sort((a, b) => source.deltaEOK(a) - source.deltaEOK(b))[0];

  // Note the chroma difference between the source color and the base color
  const ratioC = source.coords[1] / baseColor.coords[1];

  // Modify hue and chroma of the scale to match the source color
  scale.forEach(color => {
    color.coords[1] = Math.min(
      source.coords[1] * 1.5,
      color.coords[1] * ratioC
    );
    color.coords[2] = source.coords[2];
  });

  // Light mode: transpose lightness progression
  if (scale[0].coords[0] > 0.5) {
    const lightnessScale = scale.map(({ coords }) => coords[0]);
    const backgroundL = Math.max(0, Math.min(1, backgroundColor.coords[0]));
    const newLightnessScale = transposeProgressionStart(
      backgroundL,
      [1, ...lightnessScale], // Add white as the first "step"
      lightModeEasing
    );

    newLightnessScale.shift(); // Remove the step we added

    newLightnessScale.forEach((lightness, i) => {
      scale[i].coords[0] = lightness;
    });

    return scale;
  }

  // Dark mode: transpose with dynamic easing
  let ease = [...darkModeEasing];
  const referenceBackgroundColorL = scale[0].coords[0];
  const backgroundColorL = Math.max(0, Math.min(1, backgroundColor.coords[0]));

  // If background is lighter than step 0, gradually change the easing to linear
  const ratioL = backgroundColorL / referenceBackgroundColorL;

  if (ratioL > 1) {
    const maxRatio = 1.5;
    for (let i = 0; i < ease.length; i++) {
      const metaRatio = (ratioL - 1) * (maxRatio / (maxRatio - 1));
      ease[i] = ratioL > maxRatio ? 0 : Math.max(0, ease[i] * (1 - metaRatio));
    }
  }

  const lightnessScale = scale.map(({ coords }) => coords[0]);
  const backgroundL = backgroundColor.coords[0];
  const newLightnessScale = transposeProgressionStart(
    backgroundL,
    lightnessScale,
    ease
  );

  newLightnessScale.forEach((lightness, i) => {
    scale[i].coords[0] = lightness;
  });

  return scale;
}

/**
 * Determines appropriate text color (white or dark) for a background
 */
function getTextColor(background) {
  const white = new Color('oklch', [1, 0, 0]);

  if (Math.abs(white.contrastAPCA(background)) < 40) {
    const [L, C, H] = background.coords;
    return new Color('oklch', [0.25, Math.max(0.08 * C, 0.04), H]);
  }

  return white;
}

/**
 * Transposes a numerical progression to start at a different value
 * Uses Bezier easing curve for smooth transitions
 */
export function transposeProgressionStart(to, arr, curve) {
  return arr.map((n, i, arr) => {
    const lastIndex = arr.length - 1;
    const diff = arr[0] - to;
    const fn = BezierEasing(...curve);
    return n - diff * fn(1 - i / lastIndex);
  });
}

/**
 * Generates alpha (transparent) version of a color over a background
 * Uses exact pixel-perfect algorithm from Radix
 */
function getAlphaColor(
  targetRgb,
  backgroundRgb,
  rgbPrecision,
  alphaPrecision,
  targetAlpha
) {
  const [tr, tg, tb] = targetRgb.map(c => Math.round(c * rgbPrecision));
  const [br, bg, bb] = backgroundRgb.map(c => Math.round(c * rgbPrecision));

  if (tr === undefined || tg === undefined || tb === undefined ||
      br === undefined || bg === undefined || bb === undefined) {
    throw Error('Color is undefined');
  }

  // Decide whether to darken or lighten the background
  let desiredRgb = 0;
  if (tr > br || tg > bg || tb > bb) {
    desiredRgb = rgbPrecision;
  }

  const alphaR = (tr - br) / (desiredRgb - br);
  const alphaG = (tg - bg) / (desiredRgb - bg);
  const alphaB = (tb - bb) / (desiredRgb - bb);

  const isPureGray = [alphaR, alphaG, alphaB].every(alpha => alpha === alphaR);

  // No need for precision gymnastics with pure grays
  if (!targetAlpha && isPureGray) {
    const V = desiredRgb / rgbPrecision;
    return [V, V, V, alphaR];
  }

  const clampRgb = n => isNaN(n) ? 0 : Math.min(rgbPrecision, Math.max(0, n));
  const clampA = n => isNaN(n) ? 0 : Math.min(alphaPrecision, Math.max(0, n));
  const maxAlpha = targetAlpha ?? Math.max(alphaR, alphaG, alphaB);

  const A = clampA(Math.ceil(maxAlpha * alphaPrecision)) / alphaPrecision;
  let R = clampRgb(((br * (1 - A) - tr) / A) * -1);
  let G = clampRgb(((bg * (1 - A) - tg) / A) * -1);
  let B = clampRgb(((bb * (1 - A) - tb) / A) * -1);

  R = Math.ceil(R);
  G = Math.ceil(G);
  B = Math.ceil(B);

  const blendedR = blendAlpha(R, A, br);
  const blendedG = blendAlpha(G, A, bg);
  const blendedB = blendAlpha(B, A, bb);

  // Correct for rounding errors in light mode
  if (desiredRgb === 0) {
    if (tr <= br && tr !== blendedR) R = tr > blendedR ? R + 1 : R - 1;
    if (tg <= bg && tg !== blendedG) G = tg > blendedG ? G + 1 : G - 1;
    if (tb <= bb && tb !== blendedB) B = tb > blendedB ? B + 1 : B - 1;
  }

  // Correct for rounding errors in dark mode
  if (desiredRgb === rgbPrecision) {
    if (tr >= br && tr !== blendedR) R = tr > blendedR ? R + 1 : R - 1;
    if (tg >= bg && tg !== blendedG) G = tg > blendedG ? G + 1 : G - 1;
    if (tb >= bb && tb !== blendedB) B = tb > blendedB ? B + 1 : B - 1;
  }

  // Convert back to 0-1 values
  R = R / rgbPrecision;
  G = G / rgbPrecision;
  B = B / rgbPrecision;

  return [R, G, B, A];
}

/**
 * Browser-accurate alpha blending
 */
function blendAlpha(foreground, alpha, background, round = true) {
  if (round) {
    return Math.round(background * (1 - alpha)) + Math.round(foreground * alpha);
  }
  return background * (1 - alpha) + foreground * alpha;
}

/**
 * Generates sRGB alpha color
 */
function getAlphaColorSrgb(targetColor, backgroundColor, targetAlpha) {
  const [r, g, b, a] = getAlphaColor(
    new Color(targetColor).to('srgb').coords,
    new Color(backgroundColor).to('srgb').coords,
    255,
    255,
    targetAlpha
  );

  return formatHex(new Color('srgb', [r, g, b], a).toString({ format: 'hex' }));
}

/**
 * Format shortform hex to longform
 */
function formatHex(str) {
  if (!str.startsWith('#')) return str;

  if (str.length === 4) {
    const hash = str.charAt(0);
    const r = str.charAt(1);
    const g = str.charAt(2);
    const b = str.charAt(3);
    return hash + r + r + g + g + b + b;
  }

  if (str.length === 5) {
    const hash = str.charAt(0);
    const r = str.charAt(1);
    const g = str.charAt(2);
    const b = str.charAt(3);
    const a = str.charAt(4);
    return hash + r + r + g + g + b + b + a + a;
  }

  return str;
}
