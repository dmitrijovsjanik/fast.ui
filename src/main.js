/**
 * Main UI Logic for Fast UI Color Generator
 */

import { generateThemeColors } from './core/themeColorGenerator.js';

// DOM Elements
const brandColorInput = document.getElementById('brandColorInput');
const brandColorHex = document.getElementById('brandColorHex');
const output = document.getElementById('output');
const scalesContainer = document.getElementById('scalesContainer');
const themeBtns = document.querySelectorAll('.theme-btn');

let currentTheme = 'light';

// Sync color picker with text input and auto-generate
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

// Theme toggle
themeBtns.forEach(btn => {
  btn.addEventListener('click', () => {
    themeBtns.forEach(b => b.classList.remove('active'));
    btn.classList.add('active');
    currentTheme = btn.dataset.theme;
    generate();
  });
});

function generate() {
  const brandColor = brandColorHex.value;
  const background = currentTheme === 'light' ? '#ffffff' : '#0a0a0a';

  try {
    const theme = generateThemeColors({
      appearance: currentTheme,
      accentColor: brandColor,  // accent = brand
      brandColor: brandColor,   // brand = brand
      grayColor: null,          // auto-generate gray
      background,
    });

    displayResults(theme);
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
        // Skip step 9 (Solid) in UI display
        if (index === 8) return '';
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

// Generate default palette on load
generate();
