/**
 * Example usage of Fast UI Color Generator
 */

import { generatePaletteFromBrand, generateSemanticColors } from './src/index.js';

// Example 1: Generate semantic colors only
console.log('=== Example 1: Semantic Colors ===');
const semanticColors = generateSemanticColors('#3D63DD');
console.log('Brand Color: #3D63DD');
console.log('Derived Colors:', semanticColors);
console.log('');

// Example 2: Generate complete palette for light theme
console.log('=== Example 2: Light Theme Palette ===');
const lightPalette = generatePaletteFromBrand('#3D63DD', { theme: 'light' });
console.log('Brand Scale:', lightPalette.palette.brand.scale);
console.log('');

// Example 3: Generate complete palette for dark theme
console.log('=== Example 3: Dark Theme Palette ===');
const darkPalette = generatePaletteFromBrand('#3D63DD', { theme: 'dark' });
console.log('Brand Scale:', darkPalette.palette.brand.scale);
console.log('');

// Example 4: Generate both themes at once
console.log('=== Example 4: Both Themes ===');
const bothThemes = generatePaletteFromBrand('#3D63DD', { includeBothThemes: true });
console.log('Light Success Scale:', bothThemes.light.success.scale);
console.log('Dark Success Scale:', bothThemes.dark.success.scale);
console.log('');

// Example 5: Try different brand colors
console.log('=== Example 5: Different Brand Colors ===');
const colors = ['#3D63DD', '#E5484D', '#46A758', '#F76808', '#8E4EC6'];
colors.forEach(color => {
  const derived = generateSemanticColors(color);
  console.log(`Brand: ${color} -> Success: ${derived.success}, Error: ${derived.error}`);
});
