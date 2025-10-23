/**
 * Exact Radix UI Colors algorithm implementation
 * This is a wrapper around the core Radix algorithm for easier integration
 */

import { generateRadixColors } from './radixAlgorithm.js';

/**
 * Generate a 12-step color scale using exact Radix UI algorithm
 * @param {string} baseColor - HEX color
 * @param {'light'|'dark'} theme - Theme type
 * @param {'accent'|'gray'} scaleType - Type of scale
 * @param {string} backgroundColor - Background color (optional)
 * @returns {string[]} Array of 12 HEX colors
 */
export function generateScale(baseColor, theme = 'light', scaleType = 'accent', backgroundColor = null) {
  const bgColor = backgroundColor || (theme === 'light' ? '#ffffff' : '#000000');
  const grayColor = scaleType === 'gray' ? baseColor : (theme === 'light' ? '#888888' : '#888888');
  const accentColor = scaleType === 'accent' ? baseColor : baseColor;

  const result = generateRadixColors({
    appearance: theme,
    accent: accentColor,
    gray: grayColor,
    background: bgColor
  });

  return scaleType === 'gray' ? result.grayScale : result.accentScale;
}

/**
 * Generate alpha (transparent) variants of a scale
 * Uses exact Radix algorithm for alpha color calculation
 * @param {string[]} scale - Array of 12 colors
 * @param {string} background - Background color for alpha calculation
 * @returns {string[]} Array of 12 hex colors with alpha
 */
export function generateAlphaScale(scale, background = '#ffffff') {
  // Re-generate using Radix algorithm to get proper alpha colors
  // This is a simplified approach - the actual alpha calculation happens in radixAlgorithm.js
  const result = generateRadixColors({
    appearance: background === '#ffffff' || background === '#fff' ? 'light' : 'dark',
    accent: scale[8], // Use the solid color (step 9) as base
    gray: '#888888',
    background: background
  });

  return result.accentScaleAlpha;
}

/**
 * Generate complete color scales for all semantic colors
 * @param {object} semanticColors - Object with brand, success, warning, error, neutral colors
 * @param {'light'|'dark'} theme - Theme type
 * @returns {object} Complete palette with all scales
 */
export function generateCompletePalette(semanticColors, theme = 'light') {
  const { brand, success, warning, error, neutral } = semanticColors;
  const bgColor = theme === 'light' ? '#ffffff' : '#000000';

  // Generate all scales
  const brandResult = generateRadixColors({
    appearance: theme,
    accent: brand,
    gray: neutral,
    background: bgColor
  });

  const successResult = generateRadixColors({
    appearance: theme,
    accent: success,
    gray: neutral,
    background: bgColor
  });

  const warningResult = generateRadixColors({
    appearance: theme,
    accent: warning,
    gray: neutral,
    background: bgColor
  });

  const errorResult = generateRadixColors({
    appearance: theme,
    accent: error,
    gray: neutral,
    background: bgColor
  });

  const neutralResult = generateRadixColors({
    appearance: theme,
    accent: neutral,
    gray: neutral,
    background: bgColor
  });

  return {
    brand: {
      scale: brandResult.accentScale,
      alpha: brandResult.accentScaleAlpha
    },
    success: {
      scale: successResult.accentScale,
      alpha: successResult.accentScaleAlpha
    },
    warning: {
      scale: warningResult.accentScale,
      alpha: warningResult.accentScaleAlpha
    },
    error: {
      scale: errorResult.accentScale,
      alpha: errorResult.accentScaleAlpha
    },
    neutral: {
      scale: neutralResult.grayScale,
      alpha: neutralResult.grayScaleAlpha
    }
  };
}
