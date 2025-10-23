# Fast UI Color Generator

Сервис для автоматической генерации цветовых палитр для дизайн-систем на основе одного брендового цвета.

## Что делает этот сервис?

1. **Вы выбираете брендовый цвет** - основной цвет вашего бренда
2. **Автоматически генерируются:**
   - Success (зеленый) - для успешных операций
   - Warning (янтарный) - для предупреждений
   - Error (красный) - для ошибок
   - Neutrals (серые) - для нейтральных элементов
3. **Создаются 12-ступенчатые цветовые шкалы** по методологии Radix UI для каждого цвета
4. **Светлая и темная темы** + варианты с прозрачностью

## Архитектура

```
Brand Color Input (HEX)
         ↓
Color Derivation (A Nice Red Algorithm)
    ├── Success (Green)
    ├── Warning (Amber)
    ├── Error (Red)
    └── Neutrals (Gray)
         ↓
Scale Generation (Radix UI Algorithm)
    ├── Light Theme (12 steps)
    ├── Dark Theme (12 steps)
    └── Alpha Variants
         ↓
Output (CSS Variables, JSON)
```

## Технологии

### Алгоритмы генерации цветов

**A Nice Red Algorithm** (для подбора цветов статусов):
- Анализирует HSL компоненты брендового цвета
- Подбирает оптимальные hue для каждого семантического цвета
- Регулирует saturation и lightness для гармоничного сочетания

**Radix UI Color System** (для создания шкал):
- 12-ступенчатая система для каждого цвета
- Доступные контрасты по APCA
- Поддержка Display P3 color space

### Структура 12-ступенчатой шкалы

1-2: App backgrounds (фоны приложения)
3-5: Component backgrounds (фоны компонентов - normal, hover, pressed)
6-8: Borders (границы - subtle, interactive, focus)
9-10: Solid backgrounds (кнопки - normal, hover)
11-12: Text (низкий/высокий контраст)

## Структура проекта

```
/src
  /core           - Основные алгоритмы генерации
    colorDerivation.js    - Подбор цветов статусов (A Nice Red)
    scaleGenerator.js     - Генерация 12-ступенчатых шкал (Radix UI)
  /ui            - Интерфейс пользователя
  /utils         - Вспомогательные функции
/Ref             - Референсные материалы
  /A Nice Red    - Исходные алгоритмы подбора цветов
```

## Использование

```javascript
import { generatePaletteFromBrand } from './src/core';

const brandColor = '#3D63DD'; // Ваш брендовый цвет

const palette = generatePaletteFromBrand(brandColor);
// Returns:
// {
//   brand: { light: [...12 colors], dark: [...12 colors], alpha: [...] },
//   success: { light: [...], dark: [...], alpha: [...] },
//   warning: { light: [...], dark: [...], alpha: [...] },
//   error: { light: [...], dark: [...], alpha: [...] },
//   neutral: { light: [...], dark: [...], alpha: [...] }
// }
```

## Roadmap

- [ ] Core алгоритмы генерации
- [ ] Веб-интерфейс для выбора цвета
- [ ] Экспорт в CSS Variables
- [ ] Экспорт в JSON
- [ ] Экспорт в Tailwind Config
- [ ] Предпросмотр компонентов с палитрой
- [ ] API для интеграции

## Ссылки

- [Radix UI Colors](https://www.radix-ui.com/colors)
- [Radix Theme Generator](https://github.com/digitaljohn/radix-theme-generator)
- [A Nice Red (Algorithm Reference)](Ref/A%20Nice%20Red/)

## Лицензия

MIT
