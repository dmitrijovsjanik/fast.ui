/**
 * Main UI Logic for Fast UI Color Generator
 */

import { generateThemeColors } from './core/themeColorGenerator.js';

// DOM Elements
const brandColorInput = document.getElementById('brandColorInput');
const brandColorHex = document.getElementById('brandColorHex');
const bgColorInput = document.getElementById('bgColorInput');
const bgColorHex = document.getElementById('bgColorHex');
const output = document.getElementById('output');
const scalesContainer = document.getElementById('scalesContainer');
const themeBtns = document.querySelectorAll('.theme-btn');

let currentTheme = 'light';

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
  generate();
});

bgColorHex.addEventListener('input', (e) => {
  const value = e.target.value;
  if (/^#[0-9A-Fa-f]{6}$/.test(value)) {
    bgColorInput.value = value;
    generate();
  }
});

// Theme toggle
themeBtns.forEach(btn => {
  btn.addEventListener('click', () => {
    themeBtns.forEach(b => b.classList.remove('active'));
    btn.classList.add('active');
    currentTheme = btn.dataset.theme;

    // Update background color based on theme
    const defaultBg = currentTheme === 'light' ? '#ffffff' : '#111111';
    bgColorInput.value = defaultBg;
    bgColorHex.value = defaultBg.toUpperCase();

    generate();
  });
});

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

// Generate default palette on load
generate();
