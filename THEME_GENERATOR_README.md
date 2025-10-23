# Theme Color Generator

Автоматический генератор цветовых тем на основе алгоритмов **Radix Colors** и **"A Nice Red"**.

## Концепция

Система автоматически генерирует полную цветовую палитру на основе минимального набора входных данных:

### Пользователь выбирает:
- **Accent Color** - основной акцентный цвет
- **Brand Color** - цвет бренда
- **Gray Color** (опционально для dark темы) - базовый серый цвет

### Система автоматически генерирует:
- **Status Colors** (success, warning, error, info) - подбирает оптимальные оттенки
- **Gray Scale** - генерирует полную шкалу серых оттенков
- **Полные палитры** - для каждого цвета создаёт шкалу из 12 ступеней

## Два алгоритма генерации

### 1. Accent Algorithm
Используется для:
- Brand
- Accent
- Status colors (success, warning, error, info)

Генерирует полноцветную палитру с учётом:
- Hue, Saturation, Lightness
- OKLCH цветовое пространство
- Контрастность и читаемость
- Wide gamut (P3) поддержка

### 2. Gray Algorithm
Используется для:
- Gray scale
- Dark background tints

Генерирует нейтральную палитру с учётом:
- Холодные/тёплые оттенки серого
- Адаптация к primary цвету
- Оптимальная контрастность

## Использование

### Базовый пример

```javascript
import { generateThemeColors } from './src/core/themeColorGenerator.js';

const theme = generateThemeColors({
  appearance: 'light',
  accentColor: '#3b82f6',  // Синий
  brandColor: '#8b5cf6',   // Фиолетовый
  grayColor: null,         // Автоподбор
  background: '#ffffff',
});

console.log(theme.accent.scale);    // 12 оттенков accent
console.log(theme.success.baseColor); // Автоподобранный success
console.log(theme.gray.scale);      // 12 оттенков gray
```

### Dark тема

```javascript
const darkTheme = generateThemeColors({
  appearance: 'dark',
  accentColor: '#3b82f6',
  brandColor: '#8b5cf6',
  grayColor: '#1f2937',    // Пользовательский gray для dark
  background: '#0a0a0a',
});
```

### Предпросмотр базовых цветов

```javascript
import { generateThemeBaseColors } from './src/core/themeColorGenerator.js';

const baseColors = generateThemeBaseColors({
  accentColor: '#3b82f6',
  brandColor: '#8b5cf6',
  grayColor: null,
});

// Возвращает только базовые цвета без полных палитр
console.log(baseColors);
// {
//   accent: '#3b82f6',
//   brand: '#8b5cf6',
//   success: '#81e052',
//   warning: '#fcbd50',
//   error: '#ee2b2b',
//   info: '#44a1e4',
//   gray: '#415058'
// }
```

## Структура выходных данных

```javascript
{
  accent: {
    scale: [...],              // 12 HEX цветов
    scaleAlpha: [...],         // 12 Alpha HEX
    scaleWideGamut: [...],     // 12 OKLCH (P3)
    scaleAlphaWideGamut: [...],// 12 Alpha OKLCH
    contrast: '#fff',          // Контрастный текст
    surface: '#...',           // Surface цвет
    surfaceWideGamut: '...',   // Surface P3
  },

  brand: { /* та же структура */ },

  success: {
    baseColor: '#81e052',      // Подобранный базовый цвет
    scale: [...],              // 12 оттенков
    // ... остальные поля как у accent
  },

  warning: { /* та же структура */ },
  error: { /* та же структура */ },
  info: { /* та же структура */ },

  gray: {
    baseColor: '#415058',      // Подобранный базовый gray
    scale: [...],              // 12 оттенков серого
    scaleAlpha: [...],
    scaleWideGamut: [...],
    scaleAlphaWideGamut: [...],
    surface: '...',
    surfaceWideGamut: '...',
  },

  background: '#ffffff'
}
```

## Алгоритмы подбора Status цветов

### Success (Green)
- Подбирает зелёный оттенок на основе primary цвета
- H: 80-130° в зависимости от primary
- S: 55-70%
- L: 45-60%

### Warning (Amber)
- Подбирает янтарный/жёлтый оттенок
- H: 38-42° в зависимости от primary
- S: 80-100%
- L: 55-65%

### Error (Red)
- Подбирает красный оттенок
- H: 0-10° в зависимости от primary
- S: 75-85%
- L: 45-55%

### Info (Blue)
- Подбирает синий оттенок
- H: 200-210° в зависимости от primary
- S: 60-75%
- L: 48-58%

### Gray
- Подбирает нейтральный серый с тёплым/холодным оттенком
- H: 200-220° в зависимости от primary
- S: 15%
- L: 30%

## Примеры тем

### Blue Theme
```javascript
generateThemeColors({
  appearance: 'light',
  accentColor: '#3b82f6',
  brandColor: '#8b5cf6',
  grayColor: null,
  background: '#ffffff',
})
```

### Red Theme (Warm)
```javascript
generateThemeColors({
  appearance: 'light',
  accentColor: '#ef4444',
  brandColor: '#dc2626',
  grayColor: null,
  background: '#ffffff',
})
```

### Green Theme (Cool)
```javascript
generateThemeColors({
  appearance: 'light',
  accentColor: '#10b981',
  brandColor: '#059669',
  grayColor: null,
  background: '#ffffff',
})
```

## Технические детали

### Цветовые пространства
- **Input**: HEX (sRGB)
- **Processing**: OKLCH (perceptually uniform)
- **Output**: HEX, Alpha HEX, OKLCH, Alpha OKLCH

### Поддержка Wide Gamut
- P3 цветовое пространство
- Автоматическая конвертация
- Fallback на sRGB

### Контрастность
- APCA (Accessible Perceptual Contrast Algorithm)
- Автоматический подбор контрастного текста
- Оптимизация для читаемости

## Зависимости

```json
{
  "colorjs.io": "^0.5.2",
  "bezier-easing": "^2.1.0",
  "@radix-ui/colors": "^3.0.0"
}
```

## Файлы проекта

```
src/
  core/
    statusColorPicker.js      - Алгоритмы подбора оттенков
    generateRadixColors.js    - Генерация палитр Radix
    themeColorGenerator.js    - Главный генератор тем

example-theme-generator.js    - Примеры использования
```

## Запуск примеров

```bash
node example-theme-generator.js
```

## Интеграция в UI

Для создания UI генератора тем вам нужно:

1. **Форма ввода**:
   - Color picker для Accent
   - Color picker для Brand
   - Color picker для Gray (опционально)
   - Переключатель Light/Dark
   - Input для Background

2. **Предпросмотр**:
   ```javascript
   const preview = generateThemeBaseColors({
     accentColor: userInput.accent,
     brandColor: userInput.brand,
     grayColor: userInput.gray,
   });
   ```

3. **Генерация полной темы**:
   ```javascript
   const fullTheme = generateThemeColors({
     appearance: userInput.appearance,
     accentColor: userInput.accent,
     brandColor: userInput.brand,
     grayColor: userInput.gray,
     background: userInput.background,
   });
   ```

4. **Экспорт**:
   - CSS Variables
   - JSON
   - Tailwind Config
   - Radix Themes Config

## Roadmap

- [ ] Генерация CSS переменных
- [ ] Экспорт в Tailwind config
- [ ] Экспорт в Figma tokens
- [ ] Accessibility checker
- [ ] Цветовые гармонии (triadic, complementary, etc.)
- [ ] Предустановленные темы
- [ ] История генераций
