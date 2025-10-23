import { generateRadixColors } from './src/core/radixAlgorithm.js';
import Color from 'colorjs.io';

// Monkey-patch to add logging
const originalGenerate = generateRadixColors;

console.log('Testing #2DE665 (problematic green)');
console.log('='.repeat(80));

const result = originalGenerate({
  appearance: 'light',
  accent: '#2DE665',
  gray: '#808080',
  background: '#ffffff'
});

console.log('\nFinal scale:');
result.accentScale.forEach((hex, i) => {
  const oklch = new Color(hex).to('oklch');
  console.log(`Step ${(i+1).toString().padStart(2)}: ${hex} | L: ${oklch.coords[0].toFixed(4)}`);
});

console.log('\n\n' + '='.repeat(80));
console.log('Testing #5792B7 (working blue-purple)');
console.log('='.repeat(80));

const result2 = originalGenerate({
  appearance: 'light',
  accent: '#5792B7',
  gray: '#808080',
  background: '#ffffff'
});

console.log('\nFinal scale:');
result2.accentScale.forEach((hex, i) => {
  const oklch = new Color(hex).to('oklch');
  console.log(`Step ${(i+1).toString().padStart(2)}: ${hex} | L: ${oklch.coords[0].toFixed(4)}`);
});

console.log('\n\n*** KEY OBSERVATION ***');
const green8 = new Color(result.accentScale[7]).to('oklch');
const green9 = new Color(result.accentScale[8]).to('oklch');
const blue8 = new Color(result2.accentScale[7]).to('oklch');
const blue9 = new Color(result2.accentScale[8]).to('oklch');

console.log('Green:');
console.log('  Step 8 L:', green8.coords[0].toFixed(4));
console.log('  Step 9 L:', green9.coords[0].toFixed(4), '(user input color)');
console.log('  Difference:', (green9.coords[0] - green8.coords[0]).toFixed(4));
console.log('  Problem: Step 9 is LIGHTER than step 8!');

console.log('\nBlue-Purple:');
console.log('  Step 8 L:', blue8.coords[0].toFixed(4));
console.log('  Step 9 L:', blue9.coords[0].toFixed(4), '(user input color)');
console.log('  Difference:', (blue9.coords[0] - blue8.coords[0]).toFixed(4));
console.log('  OK: Step 9 is DARKER than step 8');
