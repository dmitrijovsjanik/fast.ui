import { generateRadixColors } from './src/core/radixAlgorithm.js';
import Color from 'colorjs.io';

// Test colors
const colors = [
  { name: 'Green (#2DE665)', hex: '#2DE665' },
  { name: 'Blue-Purple (#5792B7)', hex: '#5792B7' }
];

console.log('='.repeat(80));
console.log('COLOR GENERATION COMPARISON TEST');
console.log('='.repeat(80));

colors.forEach(({ name, hex }) => {
  console.log('\n' + '-'.repeat(80));
  console.log(`Testing: ${name}`);
  console.log('-'.repeat(80));

  const result = generateRadixColors({
    appearance: 'light',
    accent: hex,
    gray: '#808080',
    background: '#ffffff'
  });

  console.log('\nAccent Scale (steps 1-12):');
  result.accentScale.forEach((color, i) => {
    const oklch = new Color(color).to('oklch');
    const [L, C, H] = oklch.coords;
    console.log(`  Step ${(i + 1).toString().padStart(2)}: ${color.padEnd(9)} | L: ${L.toFixed(3)}, C: ${C.toFixed(3)}, H: ${(H || 0).toFixed(1)}`);
  });

  // Highlight step 8 specifically
  const step8 = new Color(result.accentScale[7]).to('oklch');
  console.log('\n*** STEP 8 ANALYSIS ***');
  console.log(`  Color: ${result.accentScale[7]}`);
  console.log(`  Lightness: ${step8.coords[0].toFixed(3)}`);
  console.log(`  Chroma: ${step8.coords[1].toFixed(3)}`);
  console.log(`  Hue: ${(step8.coords[2] || 0).toFixed(1)}`);
});

console.log('\n' + '='.repeat(80));
