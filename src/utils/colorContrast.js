/**
 * Color contrast utilities for WCAG AA compliance verification
 */

/**
 * Convert hex color to RGB values
 * @param {string} hex - Hex color code (e.g., '#FF8C42')
 * @returns {Object} RGB values {r, g, b}
 */
function hexToRgb(hex) {
  const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
  return result ? {
    r: parseInt(result[1], 16),
    g: parseInt(result[2], 16),
    b: parseInt(result[3], 16)
  } : null;
}

/**
 * Calculate relative luminance of a color
 * @param {Object} rgb - RGB values {r, g, b}
 * @returns {number} Relative luminance (0-1)
 */
function getLuminance(rgb) {
  const { r, g, b } = rgb;
  
  // Convert to sRGB
  const rsRGB = r / 255;
  const gsRGB = g / 255;
  const bsRGB = b / 255;
  
  // Apply gamma correction
  const rLinear = rsRGB <= 0.03928 ? rsRGB / 12.92 : Math.pow((rsRGB + 0.055) / 1.055, 2.4);
  const gLinear = gsRGB <= 0.03928 ? gsRGB / 12.92 : Math.pow((gsRGB + 0.055) / 1.055, 2.4);
  const bLinear = bsRGB <= 0.03928 ? bsRGB / 12.92 : Math.pow((bsRGB + 0.055) / 1.055, 2.4);
  
  // Calculate luminance
  return 0.2126 * rLinear + 0.7152 * gLinear + 0.0722 * bLinear;
}

/**
 * Calculate contrast ratio between two colors
 * @param {string} color1 - First hex color
 * @param {string} color2 - Second hex color
 * @returns {number} Contrast ratio (1-21)
 */
export function getContrastRatio(color1, color2) {
  const rgb1 = hexToRgb(color1);
  const rgb2 = hexToRgb(color2);
  
  if (!rgb1 || !rgb2) {
    throw new Error('Invalid hex color format');
  }
  
  const lum1 = getLuminance(rgb1);
  const lum2 = getLuminance(rgb2);
  
  const lighter = Math.max(lum1, lum2);
  const darker = Math.min(lum1, lum2);
  
  return (lighter + 0.05) / (darker + 0.05);
}

/**
 * Check if contrast ratio meets WCAG AA standards
 * @param {number} ratio - Contrast ratio
 * @param {string} level - 'normal' or 'large' text
 * @returns {boolean} True if meets WCAG AA
 */
export function meetsWCAG_AA(ratio, level = 'normal') {
  // WCAG AA requires 4.5:1 for normal text, 3:1 for large text
  const threshold = level === 'large' ? 3 : 4.5;
  return ratio >= threshold;
}

/**
 * Verify theme color contrast meets WCAG AA standards
 * @param {Object} theme - Theme object with color properties
 * @returns {Object} Verification results
 */
export function verifyThemeContrast(theme) {
  const results = {
    textOnBackground: getContrastRatio(theme.text, theme.background),
    primaryOnBackground: getContrastRatio(theme.primary, theme.background),
    secondaryOnBackground: getContrastRatio(theme.secondary, theme.background),
    accentOnBackground: getContrastRatio(theme.accent, theme.background),
  };
  
  const compliance = {
    textOnBackground: meetsWCAG_AA(results.textOnBackground, 'normal'),
    primaryOnBackground: meetsWCAG_AA(results.primaryOnBackground, 'large'),
    secondaryOnBackground: meetsWCAG_AA(results.secondaryOnBackground, 'large'),
    accentOnBackground: meetsWCAG_AA(results.accentOnBackground, 'large'),
  };
  
  return {
    ratios: results,
    compliance,
    allPass: Object.values(compliance).every(v => v),
  };
}
