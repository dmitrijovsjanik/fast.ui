/**
 * Main UI Logic for Fast UI Color Generator
 */

import { generateThemeColors } from './core/themeColorGenerator.js';

// DOM Elements
const brandColorInput = document.getElementById('brandColorInput');
const brandColorHex = document.getElementById('brandColorHex');
const bgColorInput = document.getElementById('bgColorInput');
const bgColorHex = document.getElementById('bgColorHex');
const resetBgBtn = document.getElementById('resetBgBtn');
const output = document.getElementById('output');
const scalesContainer = document.getElementById('scalesContainer');
const themeBtns = document.querySelectorAll('.theme-btn');
const copySvgBtn = document.getElementById('copySvgBtn');
const exportSvgBtn = document.getElementById('exportSvgBtn');

let currentTheme = 'light';
let currentThemeData = null;

// Default background colors
const DEFAULT_BACKGROUNDS = {
  light: '#ffffff',
  dark: '#111111'
};

// Store custom background colors for each theme
const customBackgrounds = {
  light: null,  // null means using default
  dark: null
};

// Sync brand color picker with text input and auto-generate
brandColorInput.addEventListener('input', (e) => {
  brandColorHex.value = e.target.value.toUpperCase();
  generate();
});

brandColorHex.addEventListener('input', (e) => {
  const value = e.target.value;
  if (/^#[0-9A-Fa-f]{6}$/.test(value)) {
    brandColorInput.value = value;
    generate();
  }
});

// Sync background color picker with text input and auto-generate
bgColorInput.addEventListener('input', (e) => {
  bgColorHex.value = e.target.value.toUpperCase();
  // Save custom background for current theme
  customBackgrounds[currentTheme] = e.target.value.toUpperCase();
  updateResetButtonVisibility();
  generate();
});

bgColorHex.addEventListener('input', (e) => {
  const value = e.target.value;
  if (/^#[0-9A-Fa-f]{6}$/.test(value)) {
    bgColorInput.value = value;
    // Save custom background for current theme
    customBackgrounds[currentTheme] = value.toUpperCase();
    updateResetButtonVisibility();
    generate();
  }
});

// Theme toggle
themeBtns.forEach(btn => {
  btn.addEventListener('click', () => {
    themeBtns.forEach(b => b.classList.remove('active'));
    btn.classList.add('active');
    currentTheme = btn.dataset.theme;

    // Use custom background if set, otherwise use default
    const bg = customBackgrounds[currentTheme] || DEFAULT_BACKGROUNDS[currentTheme];
    bgColorInput.value = bg;
    bgColorHex.value = bg.toUpperCase();

    updateResetButtonVisibility();
    generate();
  });
});

// Update reset button visibility based on whether background is custom
function updateResetButtonVisibility() {
  const currentBg = bgColorHex.value.toUpperCase();
  const defaultBg = DEFAULT_BACKGROUNDS[currentTheme].toUpperCase();
  const isCustom = currentBg !== defaultBg;

  resetBgBtn.style.display = isCustom ? 'flex' : 'none';
}

// Reset background to default for current theme
function resetBackground() {
  const defaultBg = DEFAULT_BACKGROUNDS[currentTheme];
  bgColorInput.value = defaultBg;
  bgColorHex.value = defaultBg.toUpperCase();
  customBackgrounds[currentTheme] = null;
  updateResetButtonVisibility();
  generate();
}

// Reset button handler
resetBgBtn.addEventListener('click', resetBackground);

function generate() {
  const brandColor = brandColorHex.value;
  const background = bgColorHex.value;

  try {
    const theme = generateThemeColors({
      appearance: currentTheme,
      accentColor: brandColor,  // accent = brand
      brandColor: brandColor,   // brand = brand
      grayColor: null,          // auto-generate gray
      background,
    });

    currentThemeData = theme;
    displayResults(theme);
    applyThemeToUI(theme);
    output.style.display = 'block';
  } catch (error) {
    console.error('Generation error:', error);
    alert('Error: ' + error.message);
  }
}

function displayResults(theme) {
  // Display scales for all colors (excluding Accent)
  const scales = {
    'Brand': theme.brand,
    'Success': theme.success,
    'Warning': theme.warning,
    'Error': theme.error,
    'Info': theme.info,
    'Gray': theme.gray,
  };

  const allGrids = Object.entries(scales).map(([name, data]) => `
    <div class="scale-grid">
      ${data.scaleAlpha.map((color, index) => {
        return `
        <div class="scale-step" style="background: ${color}" title="${color}">
          <span class="scale-step-number">${index + 1}</span>
        </div>
      `}).join('')}
    </div>
  `).join('');

  scalesContainer.innerHTML = `
    <div class="scale-section">
      ${allGrids}
    </div>
  `;
}

/**
 * Apply Radix color scales to UI elements
 * According to Radix UI methodology:
 * 1 - App background
 * 2 - Subtle background
 * 3 - UI element background
 * 4 - Hovered UI element background
 * 5 - Active / Selected UI element background
 * 6 - Subtle borders and separators
 * 7 - UI element border and focus rings
 * 8 - Hovered UI element border
 * 9 - Solid backgrounds
 * 10 - Hovered solid backgrounds
 * 11 - Low-contrast text
 * 12 - High-contrast text
 */
function applyThemeToUI(theme) {
  const gray = theme.gray.scale;        // Use non-alpha (opaque) scale
  const grayAlpha = theme.gray.scaleAlpha; // Alpha scale for transparent overlays
  const brand = theme.brand.scaleAlpha;

  // Pure background color (from user input)
  const pureBackground = theme.background;

  // Apply CSS custom properties to document root
  document.documentElement.style.setProperty('--color-bg-pure', pureBackground);   // Pure white/black background
  document.documentElement.style.setProperty('--color-bg-app', gray[0]);           // Step 1: App background
  document.documentElement.style.setProperty('--color-bg-subtle', gray[1]);        // Step 2: Subtle background
  document.documentElement.style.setProperty('--color-bg-ui', gray[2]);            // Step 3: UI element background
  document.documentElement.style.setProperty('--color-bg-hover', gray[3]);         // Step 4: Hovered UI element
  document.documentElement.style.setProperty('--color-bg-active', gray[4]);        // Step 5: Active/Selected UI element

  document.documentElement.style.setProperty('--color-border-subtle', grayAlpha[5]);    // Step 6: Subtle borders
  document.documentElement.style.setProperty('--color-border-ui', grayAlpha[6]);        // Step 7: UI element border
  document.documentElement.style.setProperty('--color-border-hover', grayAlpha[7]);     // Step 8: Hovered UI border

  document.documentElement.style.setProperty('--color-solid', gray[8]);            // Step 9: Solid backgrounds
  document.documentElement.style.setProperty('--color-solid-hover', gray[9]);      // Step 10: Hovered solid

  document.documentElement.style.setProperty('--color-text-low', gray[10]);        // Step 11: Low-contrast text
  document.documentElement.style.setProperty('--color-text-high', gray[11]);       // Step 12: High-contrast text

  // Brand colors for interactive elements
  document.documentElement.style.setProperty('--color-brand-bg', brand[2]);
  document.documentElement.style.setProperty('--color-brand-bg-hover', brand[3]);
  document.documentElement.style.setProperty('--color-brand-bg-active', brand[4]);
  document.documentElement.style.setProperty('--color-brand-border', brand[6]);
  document.documentElement.style.setProperty('--color-brand-border-hover', brand[7]);
  document.documentElement.style.setProperty('--color-brand-solid', brand[8]);
  document.documentElement.style.setProperty('--color-brand-solid-hover', brand[9]);
  document.documentElement.style.setProperty('--color-brand-text', brand[10]);

  // Apply background to body - use Gray Step 2 (Subtle background)
  document.body.style.background = gray[1];
  document.body.style.color = gray[11];
}

/**
 * Generate SVG string with all color scales
 * Includes both light and dark themes, solid and alpha modes
 * Format: [theme]/[color]/[mode]/[scale]
 * @returns {string} SVG string
 */
function generateSVG() {
  const brandColor = brandColorHex.value;
  const background = bgColorHex.value;

  // Generate both light and dark themes
  const lightTheme = generateThemeColors({
    appearance: 'light',
    accentColor: brandColor,
    brandColor: brandColor,
    grayColor: null,
    background: '#ffffff',
  });

  const darkTheme = generateThemeColors({
    appearance: 'dark',
    accentColor: brandColor,
    brandColor: brandColor,
    grayColor: null,
    background: '#111111',
  });

  const squareSize = 128;
  const gap = 8;
  const cols = 12; // 12 steps in each scale
  const rows = 24; // 6 colors × 2 modes × 2 themes = 24 rows

  // Calculate total SVG dimensions
  const svgWidth = cols * squareSize + (cols - 1) * gap;
  const svgHeight = rows * squareSize + (rows - 1) * gap;

  // Start SVG
  let svg = `<?xml version="1.0" encoding="UTF-8"?>
<svg width="${svgWidth}" height="${svgHeight}" viewBox="0 0 ${svgWidth} ${svgHeight}" xmlns="http://www.w3.org/2000/svg">
  <title>Fast UI Color Palette - All Variants</title>
`;

  let currentRow = 0;

  // Process both themes
  [
    { theme: 'light', data: lightTheme },
    { theme: 'dark', data: darkTheme }
  ].forEach(({ theme, data }) => {

    // Color scales to export (Gray is called "neutral" in export)
    const colorScales = [
      { name: 'brand', data: data.brand },
      { name: 'neutral', data: data.gray },
      { name: 'success', data: data.success },
      { name: 'warning', data: data.warning },
      { name: 'error', data: data.error },
      { name: 'info', data: data.info },
    ];

    // Process each color
    colorScales.forEach(({ name, data }) => {

      // Process both modes: solid and alpha
      [
        { mode: 'solid', colors: data.scale },
        { mode: 'alpha', colors: data.scaleAlpha }
      ].forEach(({ mode, colors }) => {

        // Generate 12 squares for this row
        colors.forEach((color, colIndex) => {
          const x = colIndex * (squareSize + gap);
          const y = currentRow * (squareSize + gap);
          const stepNumber = colIndex + 1;
          const id = `${theme}/${name}/${mode}/${stepNumber}`;

          svg += `  <rect id="${id}" x="${x}" y="${y}" width="${squareSize}" height="${squareSize}" fill="${color}">
    <title>${id}: ${color}</title>
  </rect>
`;
        });

        currentRow++;
      });
    });
  });

  svg += `</svg>`;
  return svg;
}

/**
 * Copy SVG to clipboard
 */
async function copySVG() {
  const svg = generateSVG();

  if (!svg) {
    alert('Please generate a color palette first');
    return;
  }

  try {
    await navigator.clipboard.writeText(svg);
    // Visual feedback
    const originalText = copySvgBtn.textContent;
    copySvgBtn.textContent = 'Copied!';
    setTimeout(() => {
      copySvgBtn.textContent = originalText;
    }, 2000);
  } catch (error) {
    console.error('Failed to copy SVG:', error);
    alert('Failed to copy SVG to clipboard');
  }
}

/**
 * Export SVG as downloadable file
 */
function exportSVG() {
  const svg = generateSVG();

  if (!svg) {
    alert('Please generate a color palette first');
    return;
  }

  // Download SVG file
  const blob = new Blob([svg], { type: 'image/svg+xml' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = `fast-ui-palette-${currentTheme}.svg`;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
}

// Button handlers
copySvgBtn.addEventListener('click', copySVG);
exportSvgBtn.addEventListener('click', exportSVG);

// Generate default palette on load
generate();
