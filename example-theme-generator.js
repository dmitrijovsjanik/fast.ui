/**
 * Пример использования генератора цветовой темы
 */

import { generateThemeColors, generateThemeBaseColors } from './src/core/themeColorGenerator.js';

// ========================================
// Пример 1: Генерация light темы
// ========================================
console.log('=== LIGHT THEME ===\n');

const lightTheme = generateThemeColors({
  appearance: 'light',
  accentColor: '#3b82f6',  // Синий accent - выбирает пользователь
  brandColor: '#8b5cf6',   // Фиолетовый brand - выбирает пользователь
  grayColor: null,         // Gray подбирается автоматически
  background: '#ffffff',   // Белый фон
});

console.log('Light Theme Generated:');
console.log('- Accent scale:', lightTheme.accent.scale);
console.log('- Brand scale:', lightTheme.brand.scale);
console.log('- Success base:', lightTheme.success.baseColor);
console.log('- Warning base:', lightTheme.warning.baseColor);
console.log('- Error base:', lightTheme.error.baseColor);
console.log('- Info base:', lightTheme.info.baseColor);
console.log('- Gray base:', lightTheme.gray.baseColor);
console.log('\n');

// ========================================
// Пример 2: Генерация dark темы
// ========================================
console.log('=== DARK THEME ===\n');

const darkTheme = generateThemeColors({
  appearance: 'dark',
  accentColor: '#3b82f6',  // Синий accent - выбирает пользователь
  brandColor: '#8b5cf6',   // Фиолетовый brand - выбирает пользователь
  grayColor: '#1f2937',    // Тёмно-серый для dark темы - выбирает пользователь
  background: '#0a0a0a',   // Очень тёмный фон
});

console.log('Dark Theme Generated:');
console.log('- Accent scale:', darkTheme.accent.scale);
console.log('- Brand scale:', darkTheme.brand.scale);
console.log('- Success base:', darkTheme.success.baseColor);
console.log('- Warning base:', darkTheme.warning.baseColor);
console.log('- Error base:', darkTheme.error.baseColor);
console.log('- Info base:', darkTheme.info.baseColor);
console.log('- Gray base:', darkTheme.gray.baseColor);
console.log('\n');

// ========================================
// Пример 3: Предпросмотр базовых цветов
// ========================================
console.log('=== BASE COLORS PREVIEW ===\n');

const baseColors = generateThemeBaseColors({
  accentColor: '#3b82f6',
  brandColor: '#8b5cf6',
  grayColor: null,
});

console.log('Base Colors:');
console.log('- Accent:', baseColors.accent);
console.log('- Brand:', baseColors.brand);
console.log('- Success:', baseColors.success);
console.log('- Warning:', baseColors.warning);
console.log('- Error:', baseColors.error);
console.log('- Info:', baseColors.info);
console.log('- Gray:', baseColors.gray);
console.log('\n');

// ========================================
// Пример 4: Красная тема (warm colors)
// ========================================
console.log('=== RED THEME (Warm Colors) ===\n');

const redTheme = generateThemeColors({
  appearance: 'light',
  accentColor: '#ef4444',  // Красный accent
  brandColor: '#dc2626',   // Тёмно-красный brand
  grayColor: null,
  background: '#ffffff',
});

console.log('Red Theme Base Colors:');
console.log('- Success:', redTheme.success.baseColor);
console.log('- Warning:', redTheme.warning.baseColor);
console.log('- Error:', redTheme.error.baseColor);
console.log('- Info:', redTheme.info.baseColor);
console.log('- Gray:', redTheme.gray.baseColor);
console.log('\n');

// ========================================
// Пример 5: Зелёная тема (cool colors)
// ========================================
console.log('=== GREEN THEME (Cool Colors) ===\n');

const greenTheme = generateThemeColors({
  appearance: 'light',
  accentColor: '#10b981',  // Зелёный accent
  brandColor: '#059669',   // Тёмно-зелёный brand
  grayColor: null,
  background: '#ffffff',
});

console.log('Green Theme Base Colors:');
console.log('- Success:', greenTheme.success.baseColor);
console.log('- Warning:', greenTheme.warning.baseColor);
console.log('- Error:', greenTheme.error.baseColor);
console.log('- Info:', greenTheme.info.baseColor);
console.log('- Gray:', greenTheme.gray.baseColor);
console.log('\n');

// ========================================
// Демонстрация структуры данных
// ========================================
console.log('=== FULL THEME STRUCTURE ===\n');
console.log('Full theme object keys:', Object.keys(lightTheme));
console.log('Accent palette keys:', Object.keys(lightTheme.accent));
console.log('Success palette structure:');
console.log({
  baseColor: lightTheme.success.baseColor,
  scaleLength: lightTheme.success.scale.length,
  scale: lightTheme.success.scale,
});
