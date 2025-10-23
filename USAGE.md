# Инструкция по использованию Fast UI Color Generator

## Быстрый старт

### 1. Установка зависимостей

```bash
npm install
```

### 2. Запуск веб-интерфейса

```bash
npm run dev
```

Откройте браузер по адресу http://localhost:5173

### 3. Использование веб-интерфейса

1. Выберите брендовый цвет с помощью color picker или введите HEX код
2. Выберите тему (Light/Dark)
3. Нажмите "Generate Palette"
4. Посмотрите результаты:
   - **Semantic Colors** - автоматически подобранные цвета статусов
   - **Scales** - 12-ступенчатые цветовые шкалы для каждого цвета

## Программное использование

### Импорт

```javascript
import {
  generatePaletteFromBrand,
  generateSemanticColors
} from './src/index.js';
```

### Генерация семантических цветов

```javascript
const semanticColors = generateSemanticColors('#3D63DD');
// Результат:
// {
//   brand: '#3D63DD',
//   success: '#4c9a2a',  // Зеленый
//   warning: '#f5a623',  // Янтарный
//   error: '#d0021b',    // Красный
//   neutral: '#7a8a99'   // Серый
// }
```

### Генерация полной палитры

```javascript
const palette = generatePaletteFromBrand('#3D63DD', {
  theme: 'light'
});

console.log(palette.palette.brand.scale);
// Массив из 12 цветов для брендового цвета
```

### Генерация обеих тем

```javascript
const bothThemes = generatePaletteFromBrand('#3D63DD', {
  includeBothThemes: true
});

console.log(bothThemes.light);  // Светлая тема
console.log(bothThemes.dark);   // Темная тема
```

## Структура результата

### Semantic Colors

```javascript
{
  brand: string,      // Брендовый цвет
  success: string,    // Цвет успеха (зеленый)
  warning: string,    // Цвет предупреждения (янтарный)
  error: string,      // Цвет ошибки (красный)
  neutral: string     // Нейтральный цвет (серый)
}
```

### Palette

```javascript
{
  brand: {
    scale: string[],   // 12 цветов для основной шкалы
    alpha: string[]    // 12 цветов с прозрачностью
  },
  success: { scale, alpha },
  warning: { scale, alpha },
  error: { scale, alpha },
  neutral: { scale, alpha }
}
```

## Использование 12-ступенчатой шкалы

Каждая шкала содержит 12 цветов, предназначенных для разных целей:

### Шкала использования (по номерам)

1. **App Background** - Основной фон приложения
2. **Subtle Background** - Легкий фон для секций
3. **UI Element Background** - Фон элементов UI
4. **Hovered UI Element** - Фон при наведении
5. **Active/Selected** - Фон активных/выбранных элементов
6. **Subtle Borders** - Тонкие границы
7. **UI Element Border** - Границы элементов
8. **Hovered Border** - Границы при наведении
9. **Solid Background** - Сплошной фон (кнопки)
10. **Hovered Solid** - Сплошной фон при наведении
11. **Low Contrast Text** - Текст с низким контрастом
12. **High Contrast Text** - Текст с высоким контрастом

### Пример в CSS

```css
:root {
  /* Brand colors */
  --brand-1: #fbfcfe;
  --brand-2: #f4f8ff;
  --brand-3: #e6f0ff;
  /* ... */
  --brand-12: #1a2d4a;
}

.button {
  background: var(--brand-9);  /* Solid background */
  color: var(--brand-12);       /* High contrast text */
  border: 1px solid var(--brand-7);  /* UI border */
}

.button:hover {
  background: var(--brand-10);  /* Hovered solid */
}
```

## Примеры

Запустите файл с примерами:

```bash
node example.js
```

## Экспорт результатов

### В JSON

```javascript
const palette = generatePaletteFromBrand('#3D63DD');
const json = JSON.stringify(palette, null, 2);
console.log(json);
```

### В CSS Variables

```javascript
const palette = generatePaletteFromBrand('#3D63DD');

// Генерация CSS
let css = ':root {\n';
Object.entries(palette.palette).forEach(([name, data]) => {
  data.scale.forEach((color, index) => {
    css += `  --${name}-${index + 1}: ${color};\n`;
  });
});
css += '}';

console.log(css);
```

## Алгоритмы

### A Nice Red Algorithm

Используется для автоматического подбора цветов статусов на основе брендового цвета:
- Анализирует HSL компоненты входного цвета
- Подбирает оптимальные hue для каждого семантического цвета
- Регулирует saturation и lightness для гармонии

### Radix UI Scale System

Используется для создания 12-ступенчатых шкал:
- Каждый шаг оптимизирован для конкретного use case
- Поддержка светлой и темной темы
- Гарантированные контрасты по APCA

## Следующие шаги

- Экспорт в Tailwind Config
- Экспорт в SCSS Variables
- API для интеграции
- Предпросмотр компонентов
