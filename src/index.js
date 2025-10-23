/**
 * Fast UI Color Generator - Main Entry Point
 * Generates complete color palettes from a single brand color
 */

import { deriveSemanticColors } from './core/colorDerivation.js';
import { generateCompletePalette } from './core/scaleGenerator.js';
import { isValidHex } from './utils/colorUtils.js';

/**
 * Generate complete palette from brand color
 * @param {string} brandColor - HEX color (e.g., "#3D63DD")
 * @param {object} options - Configuration options
 * @param {'light'|'dark'} options.theme - Theme type (default: 'light')
 * @param {boolean} options.includeBothThemes - Generate both themes (default: false)
 * @returns {object} Complete palette with all scales
 */
export function generatePaletteFromBrand(brandColor, options = {}) {
  const { theme = 'light', includeBothThemes = false } = options;

  // Validate input
  if (!isValidHex(brandColor)) {
    throw new Error('Invalid HEX color format. Expected format: #RRGGBB or #RGB');
  }

  // Step 1: Derive semantic colors from brand color
  const semanticColors = deriveSemanticColors(brandColor);

  if (includeBothThemes) {
    // Generate both light and dark themes
    return {
      light: generateCompletePalette(semanticColors, 'light'),
      dark: generateCompletePalette(semanticColors, 'dark'),
      semanticColors
    };
  }

  // Step 2: Generate 12-step scales for the selected theme
  const palette = generateCompletePalette(semanticColors, theme);

  return {
    theme,
    semanticColors,
    palette
  };
}

/**
 * Generate only semantic colors (no scales)
 * Useful if you only need the derived colors
 * @param {string} brandColor - HEX color
 * @returns {object} Semantic colors (brand, success, warning, error, neutral)
 */
export function generateSemanticColors(brandColor) {
  if (!isValidHex(brandColor)) {
    throw new Error('Invalid HEX color format. Expected format: #RRGGBB or #RGB');
  }

  return deriveSemanticColors(brandColor);
}

// Re-export utilities
export { deriveSemanticColors } from './core/colorDerivation.js';
export { generateScale, generateCompletePalette } from './core/scaleGenerator.js';
export { hexToHSL, hslToHex, isValidHex } from './utils/colorUtils.js';
