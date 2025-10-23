/**
 * Алгоритмы подбора оттенков для status цветов на основе primary (brand/accent) цвета
 * Адаптировано из "A Nice Red"
 */

/**
 * Подбирает оттенок для Success цвета на основе primary цвета
 * @param {number} primaryH - Hue primary цвета (0-360)
 * @param {number} primaryS - Saturation primary цвета (0-100)
 * @param {number} primaryL - Lightness primary цвета (0-100)
 * @returns {{h: number, s: number, l: number}} - HSL coordinates для success цвета
 */
export function getSuccessHue(primaryH, primaryS, primaryL) {
  let h, s, l;

  // Если сатурация слишком низкая, игнорируем Hue (он нестабилен)
  const isLowSaturation = primaryS < 10;

  // Подбор Hue
  switch (true) {
    case isLowSaturation:
      h = 120; // Default green для ненасыщенных цветов
      break;
    case primaryH < 25 || primaryH >= 335:
      h = 120;
      break;
    case primaryH >= 25 && primaryH < 75:
      h = 80;
      break;
    case primaryH >= 150 && primaryH < 210:
      h = 90;
      break;
    case primaryH >= 210 && primaryH < 285:
      h = 100;
      break;
    case primaryH >= 285 && primaryH < 335:
      h = 130;
      break;
    default:
      h = 120;
      break;
  }

  // Подбор Saturation
  switch (true) {
    case primaryS - 5 < 55:
      s = 55;
      break;
    case primaryS - 5 > 70:
      s = 70;
      break;
    default:
      s = primaryS - 5;
      break;
  }

  // Подбор Lightness
  switch (true) {
    case primaryL + 5 < 45:
      l = 45;
      break;
    case primaryL + 5 > 60:
      l = 60;
      break;
    default:
      l = primaryL + 5;
      break;
  }

  return { h, s, l };
}

/**
 * Подбирает оттенок для Warning цвета на основе primary цвета
 * @param {number} primaryH - Hue primary цвета (0-360)
 * @param {number} primaryS - Saturation primary цвета (0-100)
 * @param {number} primaryL - Lightness primary цвета (0-100)
 * @returns {{h: number, s: number, l: number}} - HSL coordinates для warning цвета
 */
export function getWarningHue(primaryH, primaryS, primaryL) {
  let h, s, l;

  // Если сатурация слишком низкая, игнорируем Hue (он нестабилен)
  const isLowSaturation = primaryS < 10;

  // Подбор Hue
  switch (true) {
    case isLowSaturation:
      h = 40; // Default orange/yellow для ненасыщенных цветов
      break;
    case primaryH >= 240 || primaryH < 60: // Red
      h = 42;
      break;
    case primaryH >= 60 && primaryH < 140: // Green
      h = 40;
      break;
    case primaryH >= 140 && primaryH < 240: // Cyan
      h = 38;
      break;
    default:
      h = 40;
      break;
  }

  // Подбор Saturation
  switch (true) {
    case primaryS + 5 < 80:
      s = 80;
      break;
    case primaryS + 5 > 100:
      s = 100;
      break;
    default:
      s = primaryS + 5;
      break;
  }

  // Подбор Lightness
  switch (true) {
    case primaryL + 15 < 55:
      l = 55;
      break;
    case primaryL + 15 > 65:
      l = 65;
      break;
    default:
      l = primaryL + 15;
      break;
  }

  return { h, s, l };
}

/**
 * Подбирает оттенок для Error цвета на основе primary цвета
 * @param {number} primaryH - Hue primary цвета (0-360)
 * @param {number} primaryS - Saturation primary цвета (0-100)
 * @param {number} primaryL - Lightness primary цвета (0-100)
 * @returns {{h: number, s: number, l: number}} - HSL coordinates для error цвета
 */
export function getErrorHue(primaryH, primaryS, primaryL) {
  let h, s, l;

  // Если сатурация слишком низкая, игнорируем Hue (он нестабилен)
  const isLowSaturation = primaryS < 10;

  // Подбор Hue
  switch (true) {
    case isLowSaturation:
      h = 0; // Default red для ненасыщенных цветов
      break;
    case primaryH >= 15 && primaryH < 60: // Yellow
      h = 5;
      break;
    case primaryH >= 60 && primaryH < 140: // Green
      h = 10;
      break;
    case primaryH >= 140 && primaryH < 190: // Cyan
      h = 357;
      break;
    case primaryH >= 190 && primaryH < 240: // Blue
      h = 0;
      break;
    case primaryH >= 240 && primaryH < 350: // Purple
      h = 355;
      break;
    default:
      h = 0;
      break;
  }

  // Подбор Saturation
  switch (true) {
    case primaryS < 75:
      s = 75;
      break;
    case primaryS > 85:
      s = 85;
      break;
    default:
      s = primaryS;
      break;
  }

  // Подбор Lightness
  switch (true) {
    case primaryL + 5 < 45:
      l = 45;
      break;
    case primaryL + 5 > 55:
      l = 55;
      break;
    default:
      l = primaryL + 5;
      break;
  }

  return { h, s, l };
}

/**
 * Подбирает оттенок для Info цвета на основе primary цвета
 * Обычно это оттенок синего
 * @param {number} primaryH - Hue primary цвета (0-360)
 * @param {number} primaryS - Saturation primary цвета (0-100)
 * @param {number} primaryL - Lightness primary цвета (0-100)
 * @returns {{h: number, s: number, l: number}} - HSL coordinates для info цвета
 */
export function getInfoHue(primaryH, primaryS, primaryL) {
  let h, s, l;

  // Если сатурация слишком низкая, игнорируем Hue (он нестабилен)
  const isLowSaturation = primaryS < 10;

  // Подбор Hue - всегда синий диапазон
  switch (true) {
    case isLowSaturation:
      h = 210; // Default blue для ненасыщенных цветов
      break;
    case primaryH < 60 || primaryH >= 300: // Red/Purple range
      h = 210;
      break;
    case primaryH >= 60 && primaryH < 160: // Green/Yellow range
      h = 200;
      break;
    case primaryH >= 160 && primaryH < 260: // Cyan/Blue range
      h = 205;
      break;
    default:
      h = 210;
      break;
  }

  // Подбор Saturation
  switch (true) {
    case primaryS < 60:
      s = 60;
      break;
    case primaryS > 75:
      s = 75;
      break;
    default:
      s = primaryS;
      break;
  }

  // Подбор Lightness
  switch (true) {
    case primaryL < 48:
      l = 48;
      break;
    case primaryL > 58:
      l = 58;
      break;
    default:
      l = primaryL;
      break;
  }

  return { h, s, l };
}

/**
 * Подбирает оттенок для Gray цвета на основе primary цвета
 * @param {number} primaryH - Hue primary цвета (0-360)
 * @returns {{h: number, s: number, l: number}} - HSL coordinates для gray цвета
 */
export function getGrayHue(primaryH) {
  let h;

  // Подбор Hue для gray на основе primary цвета
  switch (true) {
    case primaryH < 40 || primaryH >= 160:
      h = 200; // Холодный серый
      break;
    case primaryH >= 40 && primaryH < 100:
      h = 220; // Синеватый серый
      break;
    case primaryH >= 100 && primaryH < 160:
      h = 210; // Нейтральный серый
      break;
    default:
      h = 200;
      break;
  }

  // Для gray фиксированные S и L - они будут использованы как база
  // для генерации полной шкалы через алгоритм grays
  return { h, s: 15, l: 30 };
}
