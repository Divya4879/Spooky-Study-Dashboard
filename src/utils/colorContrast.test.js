import { describe, it, expect } from 'vitest';
import { getContrastRatio, meetsWCAG_AA, verifyThemeContrast } from './colorContrast';
import { THEMES } from '../constants/themes';

describe('Color Contrast Utilities', () => {
  describe('getContrastRatio', () => {
    it('should calculate correct contrast ratio for black and white', () => {
      const ratio = getContrastRatio('#000000', '#FFFFFF');
      expect(ratio).toBeCloseTo(21, 1);
    });

    it('should calculate correct contrast ratio for same colors', () => {
      const ratio = getContrastRatio('#FF8C42', '#FF8C42');
      expect(ratio).toBeCloseTo(1, 1);
    });

    it('should throw error for invalid hex colors', () => {
      expect(() => getContrastRatio('invalid', '#FFFFFF')).toThrow();
    });
  });

  describe('meetsWCAG_AA', () => {
    it('should pass for ratio >= 4.5 for normal text', () => {
      expect(meetsWCAG_AA(4.5, 'normal')).toBe(true);
      expect(meetsWCAG_AA(5.0, 'normal')).toBe(true);
    });

    it('should fail for ratio < 4.5 for normal text', () => {
      expect(meetsWCAG_AA(4.0, 'normal')).toBe(false);
      expect(meetsWCAG_AA(3.0, 'normal')).toBe(false);
    });

    it('should pass for ratio >= 3 for large text', () => {
      expect(meetsWCAG_AA(3.0, 'large')).toBe(true);
      expect(meetsWCAG_AA(4.0, 'large')).toBe(true);
    });

    it('should fail for ratio < 3 for large text', () => {
      expect(meetsWCAG_AA(2.5, 'large')).toBe(false);
    });
  });

  describe('Theme WCAG AA Compliance', () => {
    it('Vampire Crimson theme should meet WCAG AA standards', () => {
      const result = verifyThemeContrast(THEMES.vampireCrimson);
      
      console.log('Vampire Crimson contrast ratios:', result.ratios);
      console.log('Vampire Crimson compliance:', result.compliance);
      
      expect(result.compliance.textOnBackground).toBe(true);
    });

    it('Witch Forest theme should meet WCAG AA standards', () => {
      const result = verifyThemeContrast(THEMES.witchForest);
      
      console.log('Witch Forest contrast ratios:', result.ratios);
      console.log('Witch Forest compliance:', result.compliance);
      
      expect(result.compliance.textOnBackground).toBe(true);
    });

    it('Haunted Midnight theme should meet WCAG AA standards', () => {
      const result = verifyThemeContrast(THEMES.hauntedMidnight);
      
      console.log('Haunted Midnight contrast ratios:', result.ratios);
      console.log('Haunted Midnight compliance:', result.compliance);
      
      expect(result.compliance.textOnBackground).toBe(true);
    });

    it('Graveyard theme should meet WCAG AA standards', () => {
      const result = verifyThemeContrast(THEMES.graveyard);
      
      console.log('Graveyard contrast ratios:', result.ratios);
      console.log('Graveyard compliance:', result.compliance);
      
      expect(result.compliance.textOnBackground).toBe(true);
    });

    it('All themes should have sufficient text contrast', () => {
      Object.entries(THEMES).forEach(([key, theme]) => {
        const result = verifyThemeContrast(theme);
        expect(result.compliance.textOnBackground).toBe(true);
      });
    });
  });
});
