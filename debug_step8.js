import Color from 'colorjs.io';
import { getRadixBaseColors } from './src/core/radixBaseScales.js';
import { transposeProgressionStart } from './src/core/radixAlgorithm.js';
import BezierEasing from 'bezier-easing';

const lightModeEasing = [0, 2, 0, 2];

// Manually trace through the algorithm for #2DE665
const source = new Color('#2DE665').to('oklch');
const backgroundColor = new Color('#ffffff').to('oklch');

console.log('Source color #2DE665:');
console.log('  L:', source.coords[0]);
console.log('  C:', source.coords[1]);
console.log('  H:', source.coords[2]);
console.log();

// Get the scales
const { allScales } = getRadixBaseColors('light');

// Find closest scale (simplified - just check green)
const greenScale = allScales['green'];
console.log('Reference green scale (step 8, index 7):');
const refStep8 = greenScale[7];
console.log('  L:', refStep8.coords[0]);
console.log('  C:', refStep8.coords[1]);
console.log('  H:', refStep8.coords[2]);
console.log();

// After adjusting chroma/hue to match source
const baseColor = greenScale
  .slice()
  .sort((a, b) => source.deltaEOK(a) - source.deltaEOK(b))[0];

console.log('Closest color in green scale:');
console.log('  L:', baseColor.coords[0]);
console.log('  C:', baseColor.coords[1]);
console.log('  H:', baseColor.coords[2]);

const ratioC = source.coords[1] / baseColor.coords[1];
console.log('\nChroma ratio:', ratioC);

// Clone and adjust
const adjustedScale = greenScale.map(c => {
  const color = c.clone();
  color.coords[1] = Math.min(source.coords[1] * 1.5, color.coords[1] * ratioC);
  color.coords[2] = source.coords[2];
  return color;
});

console.log('\nAfter chroma/hue adjustment (step 8):');
console.log('  L:', adjustedScale[7].coords[0]);
console.log('  C:', adjustedScale[7].coords[1]);
console.log('  H:', adjustedScale[7].coords[2]);

// Now transpose the lightness
const lightnessScale = adjustedScale.map(({ coords }) => coords[0]);
const backgroundL = Math.max(0, Math.min(1, backgroundColor.coords[0]));

console.log('\nOriginal lightness scale:');
console.log(lightnessScale.map((l, i) => `  Step ${i+1}: ${l.toFixed(4)}`).join('\n'));

const newLightnessScale = transposeProgressionStart(
  backgroundL,
  [1, ...lightnessScale],
  lightModeEasing
);

newLightnessScale.shift();

console.log('\nAfter transpose (step 8):');
console.log('  L:', newLightnessScale[7]);

console.log('\nFull transposed lightness scale:');
console.log(newLightnessScale.map((l, i) => `  Step ${i+1}: ${l.toFixed(4)}`).join('\n'));

// Now check what step 9 becomes
console.log('\n\n*** FINAL VALUES ***');
console.log('Step 8 (index 7) lightness:', newLightnessScale[7]);
console.log('Source color (#2DE665) lightness:', source.coords[0]);
console.log('\nStep 8 should be LIGHTER than source, but it is DARKER!');
