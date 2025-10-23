/**
 * Генератор цветовой темы с автоматическим подбором status цветов
 * Использует алгоритмы из Radix Colors и "A Nice Red"
 */

import { generateRadixColors } from './generateRadixColors.js';
import {
  getSuccessHue,
  getWarningHue,
  getErrorHue,
  getInfoHue,
  getGrayHue
} from './statusColorPicker.js';
import Color from 'colorjs.io';

/**
 * Конвертирует HSL в HEX
 * @param {number} h - Hue (0-360)
 * @param {number} s - Saturation (0-100)
 * @param {number} l - Lightness (0-100)
 * @returns {string} - HEX color
 */
function hslToHex(h, s, l) {
  const color = new Color('hsl', [h, s, l]);
  return color.to('srgb').toString({ format: 'hex' });
}

/**
 * Генерирует полную цветовую тему
 * @param {Object} config - Конфигурация темы
 * @param {string} config.appearance - 'light' или 'dark'
 * @param {string} config.accentColor - Accent цвет (HEX) - выбирает пользователь
 * @param {string} config.brandColor - Brand цвет (HEX) - выбирает пользователь
 * @param {string} config.grayColor - Gray цвет для dark темы (HEX) - выбирает пользователь для dark темы
 * @param {string} config.background - Background цвет (HEX)
 * @returns {Object} - Полная палитра темы
 */
export function generateThemeColors(config) {
  const { appearance, accentColor, brandColor, grayColor, background } = config;

  // Конвертируем accent цвет в HSL для подбора оттенков
  const accentColorObj = new Color(accentColor).to('hsl');
  const accentH = accentColorObj.coords[0];
  const accentS = accentColorObj.coords[1];
  const accentL = accentColorObj.coords[2];

  // Подбираем оттенки для status цветов
  const successHSL = getSuccessHue(accentH, accentS, accentL);
  const warningHSL = getWarningHue(accentH, accentS, accentL);
  const errorHSL = getErrorHue(accentH, accentS, accentL);
  const infoHSL = getInfoHue(accentH, accentS, accentL);

  // Конвертируем в HEX
  const successColor = hslToHex(successHSL.h, successHSL.s, successHSL.l);
  const warningColor = hslToHex(warningHSL.h, warningHSL.s, warningHSL.l);
  const errorColor = hslToHex(errorHSL.h, errorHSL.s, errorHSL.l);
  const infoColor = hslToHex(infoHSL.h, infoHSL.s, infoHSL.l);

  // Определяем gray цвет
  let finalGrayColor = grayColor;

  // Если gray не задан, подбираем автоматически на основе accent
  if (!finalGrayColor) {
    const grayHSL = getGrayHue(accentH);
    finalGrayColor = hslToHex(grayHSL.h, grayHSL.s, grayHSL.l);
  }

  // Генерируем палитры для accent (используется алгоритм accent)
  const accentPalette = generateRadixColors({
    appearance,
    accent: accentColor,
    gray: finalGrayColor,
    background,
  });

  // Генерируем палитры для brand (используется алгоритм accent)
  const brandPalette = generateRadixColors({
    appearance,
    accent: brandColor,
    gray: finalGrayColor,
    background,
  });

  // Генерируем палитры для status цветов (используется алгоритм accent)
  const successPalette = generateRadixColors({
    appearance,
    accent: successColor,
    gray: finalGrayColor,
    background,
  });

  const warningPalette = generateRadixColors({
    appearance,
    accent: warningColor,
    gray: finalGrayColor,
    background,
  });

  const errorPalette = generateRadixColors({
    appearance,
    accent: errorColor,
    gray: finalGrayColor,
    background,
  });

  const infoPalette = generateRadixColors({
    appearance,
    accent: infoColor,
    gray: finalGrayColor,
    background,
  });

  // Генерируем палитру для gray (используется алгоритм grays)
  // Gray палитра уже генерируется внутри generateRadixColors как grayScale
  const grayPalette = accentPalette.grayScale;
  const grayPaletteAlpha = accentPalette.grayScaleAlpha;
  const grayPaletteWideGamut = accentPalette.grayScaleWideGamut;
  const grayPaletteAlphaWideGamut = accentPalette.grayScaleAlphaWideGamut;

  return {
    // Accent палитра
    accent: {
      scale: accentPalette.accentScale,
      scaleAlpha: accentPalette.accentScaleAlpha,
      scaleWideGamut: accentPalette.accentScaleWideGamut,
      scaleAlphaWideGamut: accentPalette.accentScaleAlphaWideGamut,
      contrast: accentPalette.accentContrast,
      surface: accentPalette.accentSurface,
      surfaceWideGamut: accentPalette.accentSurfaceWideGamut,
    },

    // Brand палитра
    brand: {
      scale: brandPalette.accentScale,
      scaleAlpha: brandPalette.accentScaleAlpha,
      scaleWideGamut: brandPalette.accentScaleWideGamut,
      scaleAlphaWideGamut: brandPalette.accentScaleAlphaWideGamut,
      contrast: brandPalette.accentContrast,
      surface: brandPalette.accentSurface,
      surfaceWideGamut: brandPalette.accentSurfaceWideGamut,
    },

    // Status палитры
    success: {
      baseColor: successColor,
      scale: successPalette.accentScale,
      scaleAlpha: successPalette.accentScaleAlpha,
      scaleWideGamut: successPalette.accentScaleWideGamut,
      scaleAlphaWideGamut: successPalette.accentScaleAlphaWideGamut,
      contrast: successPalette.accentContrast,
      surface: successPalette.accentSurface,
      surfaceWideGamut: successPalette.accentSurfaceWideGamut,
    },

    warning: {
      baseColor: warningColor,
      scale: warningPalette.accentScale,
      scaleAlpha: warningPalette.accentScaleAlpha,
      scaleWideGamut: warningPalette.accentScaleWideGamut,
      scaleAlphaWideGamut: warningPalette.accentScaleAlphaWideGamut,
      contrast: warningPalette.accentContrast,
      surface: warningPalette.accentSurface,
      surfaceWideGamut: warningPalette.accentSurfaceWideGamut,
    },

    error: {
      baseColor: errorColor,
      scale: errorPalette.accentScale,
      scaleAlpha: errorPalette.accentScaleAlpha,
      scaleWideGamut: errorPalette.accentScaleWideGamut,
      scaleAlphaWideGamut: errorPalette.accentScaleAlphaWideGamut,
      contrast: errorPalette.accentContrast,
      surface: errorPalette.accentSurface,
      surfaceWideGamut: errorPalette.accentSurfaceWideGamut,
    },

    info: {
      baseColor: infoColor,
      scale: infoPalette.accentScale,
      scaleAlpha: infoPalette.accentScaleAlpha,
      scaleWideGamut: infoPalette.accentScaleWideGamut,
      scaleAlphaWideGamut: infoPalette.accentScaleAlphaWideGamut,
      contrast: infoPalette.accentContrast,
      surface: infoPalette.accentSurface,
      surfaceWideGamut: infoPalette.accentSurfaceWideGamut,
    },

    // Gray палитра
    gray: {
      baseColor: finalGrayColor,
      scale: grayPalette,
      scaleAlpha: grayPaletteAlpha,
      scaleWideGamut: grayPaletteWideGamut,
      scaleAlphaWideGamut: grayPaletteAlphaWideGamut,
      surface: accentPalette.graySurface,
      surfaceWideGamut: accentPalette.graySurfaceWideGamut,
    },

    // Background
    background: accentPalette.background,
  };
}

/**
 * Генерирует упрощённую тему только с базовыми цветами (без полных палитр)
 * Полезно для предпросмотра
 */
export function generateThemeBaseColors(config) {
  const { accentColor, brandColor, grayColor } = config;

  // Конвертируем accent цвет в HSL
  const accentColorObj = new Color(accentColor).to('hsl');
  const accentH = accentColorObj.coords[0];
  const accentS = accentColorObj.coords[1];
  const accentL = accentColorObj.coords[2];

  // Подбираем оттенки для status цветов
  const successHSL = getSuccessHue(accentH, accentS, accentL);
  const warningHSL = getWarningHue(accentH, accentS, accentL);
  const errorHSL = getErrorHue(accentH, accentS, accentL);
  const infoHSL = getInfoHue(accentH, accentS, accentL);

  // Определяем gray
  let finalGrayColor = grayColor;
  if (!finalGrayColor) {
    const grayHSL = getGrayHue(accentH);
    finalGrayColor = hslToHex(grayHSL.h, grayHSL.s, grayHSL.l);
  }

  return {
    accent: accentColor,
    brand: brandColor,
    success: hslToHex(successHSL.h, successHSL.s, successHSL.l),
    warning: hslToHex(warningHSL.h, warningHSL.s, warningHSL.l),
    error: hslToHex(errorHSL.h, errorHSL.s, errorHSL.l),
    info: hslToHex(infoHSL.h, infoHSL.s, infoHSL.l),
    gray: finalGrayColor,
  };
}
