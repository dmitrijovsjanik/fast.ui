/**
 * Theme Color Generator V2 - Unified interface for all 3 variants
 *
 * Variant 1: Radix Colors (original algorithm)
 * Variant 2: OKLCH Hue Rotation
 * Variant 3: APCA-based with max chroma
 */

import { generateThemeColors as generateRadixTheme } from './themeColorGenerator.js';
import { generateOKLCHHueRotation } from './variants/oklchHueRotation.js';
import { generateAPCABased } from './variants/apcaBased.js';
import Color from 'colorjs.io';

/**
 * Get hue from hex color
 */
function getHueFromColor(hexColor) {
  const color = new Color(hexColor).to('oklch');
  return color.coords[2] || 0;
}

/**
 * Generate theme colors using selected variant
 * @param {Object} config - Configuration
 * @param {string} config.variant - 'radix' | 'oklch-hue' | 'apca'
 * @param {string} config.appearance - 'light' | 'dark'
 * @param {string} config.brandColor - Brand color (HEX)
 * @param {string} config.background - Background color (HEX)
 * @param {boolean} config.maxChroma - Use maximum chroma
 * @param {boolean} config.lockColor - Lock step 9 color
 * @param {Object} config.apcaOptions - Options for APCA variant
 */
export function generateThemeColorsV2(config) {
  const { variant = 'radix', appearance, brandColor, background, maxChroma = false, lockColor = true } = config;

  // For Radix variant, use original implementation
  if (variant === 'radix') {
    return generateRadixTheme({
      appearance,
      accentColor: brandColor,
      brandColor,
      grayColor: null,
      background,
    });
  }

  // For new variants, generate all colors from brand color hue
  const brandHue = getHueFromColor(brandColor);

  // Generate palettes for all semantic colors
  const semanticHues = {
    brand: brandHue,
    success: 145,  // Green
    warning: 60,   // Yellow
    error: 10,     // Red
    info: 240,     // Blue
    gray: brandHue, // Slightly tinted gray
  };

  // Define base colors for each semantic color (used when lockColor is false)
  const semanticColors = {
    brand: brandColor,
    success: '#10b981',  // Green
    warning: '#f59e0b',  // Amber/Yellow
    error: '#ef4444',    // Red
    info: '#3b82f6',     // Blue
    gray: null,          // Gray doesn't use a base color
  };

  const palettes = {};

  // Generate each semantic color
  for (const [name, hue] of Object.entries(semanticHues)) {
    let palette;
    const isNeutral = name === 'gray';
    // Pass semantic color for each when lockColor is disabled
    const userColor = (!lockColor && semanticColors[name]) ? semanticColors[name] : null;

    if (variant === 'oklch-hue') {
      palette = generateOKLCHHueRotation({
        targetHue: hue,
        appearance,
        background,
        isNeutral,
        maxChroma: maxChroma && !isNeutral, // Max chroma should ignore neutral
        lockColor,
        userColor,
      });
    }

    palettes[name] = palette;
  }

  // Format output to match original structure
  return {
    accent: {
      scale: palettes.brand.scale,
      scaleAlpha: palettes.brand.scaleAlpha,
      scaleWideGamut: palettes.brand.scaleWideGamut,
      scaleAlphaWideGamut: palettes.brand.scaleAlphaWideGamut,
    },
    brand: {
      scale: palettes.brand.scale,
      scaleAlpha: palettes.brand.scaleAlpha,
      scaleWideGamut: palettes.brand.scaleWideGamut,
      scaleAlphaWideGamut: palettes.brand.scaleAlphaWideGamut,
    },
    success: {
      scale: palettes.success.scale,
      scaleAlpha: palettes.success.scaleAlpha,
      scaleWideGamut: palettes.success.scaleWideGamut,
      scaleAlphaWideGamut: palettes.success.scaleAlphaWideGamut,
    },
    warning: {
      scale: palettes.warning.scale,
      scaleAlpha: palettes.warning.scaleAlpha,
      scaleWideGamut: palettes.warning.scaleWideGamut,
      scaleAlphaWideGamut: palettes.warning.scaleAlphaWideGamut,
    },
    error: {
      scale: palettes.error.scale,
      scaleAlpha: palettes.error.scaleAlpha,
      scaleWideGamut: palettes.error.scaleWideGamut,
      scaleAlphaWideGamut: palettes.error.scaleAlphaWideGamut,
    },
    info: {
      scale: palettes.info.scale,
      scaleAlpha: palettes.info.scaleAlpha,
      scaleWideGamut: palettes.info.scaleWideGamut,
      scaleAlphaWideGamut: palettes.info.scaleAlphaWideGamut,
    },
    gray: {
      scale: palettes.gray.scale,
      scaleAlpha: palettes.gray.scaleAlpha,
      scaleWideGamut: palettes.gray.scaleWideGamut,
      scaleAlphaWideGamut: palettes.gray.scaleAlphaWideGamut,
    },
    background,
    variant, // Include variant info
  };
}
