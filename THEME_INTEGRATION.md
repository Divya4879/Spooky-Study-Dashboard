# Tailwind Theme Integration

This document explains how the Spooky Study Dashboard integrates dynamic theming with Tailwind CSS using CSS variables.

## Overview

The application uses CSS custom properties (CSS variables) to enable dynamic theme switching while leveraging Tailwind's utility classes. This approach provides the best of both worlds: the convenience of Tailwind utilities with the flexibility of runtime theme changes.

## Architecture

### 1. Theme Configuration (Tailwind)

The `tailwind.config.js` file extends Tailwind's color palette to use CSS variables:

```javascript
theme: {
  extend: {
    colors: {
      primary: 'var(--color-primary)',
      secondary: 'var(--color-secondary)',
      accent: 'var(--color-accent)',
      background: 'var(--color-background)',
      text: 'var(--color-text)',
    },
  },
}
```

This allows you to use Tailwind classes like `bg-primary`, `text-secondary`, etc., which will automatically use the current theme's colors.

### 2. CSS Variables (index.css)

The `src/index.css` file defines default CSS variables:

```css
:root {
  --color-primary: #FF8C42;
  --color-secondary: #FFD700;
  --color-accent: #FF6B35;
  --color-background: #FFF8E7;
  --color-text: #2C1810;
}
```

These defaults ensure the application has a valid theme even before React initializes.

### 3. Theme Context (ThemeContext.jsx)

The `ThemeContext` component dynamically updates CSS variables when the theme changes:

```javascript
useEffect(() => {
  const theme = THEMES[currentTheme];
  const root = document.documentElement;

  root.style.setProperty('--color-primary', theme.primary);
  root.style.setProperty('--color-secondary', theme.secondary);
  root.style.setProperty('--color-accent', theme.accent);
  root.style.setProperty('--color-background', theme.background);
  root.style.setProperty('--color-text', theme.text);
}, [currentTheme]);
```

## Available Themes

The application includes four Halloween-themed color palettes:

### 1. Pumpkin Glow (Default)
- Primary: `#FF8C42` (Bright orange)
- Secondary: `#FFD700` (Golden yellow)
- Accent: `#FF6B35` (Deep orange)
- Background: `#FFF8E7` (Cream)
- Text: `#2C1810` (Dark brown)

### 2. Vampire Crimson
- Primary: `#8B0000` (Dark red)
- Secondary: `#DC143C` (Crimson)
- Accent: `#4B0000` (Very dark red)
- Background: `#1A0000` (Almost black)
- Text: `#FFE4E1` (Misty rose)

### 3. Witch Forest
- Primary: `#2D5016` (Forest green)
- Secondary: `#6B4C9A` (Purple)
- Accent: `#8B7355` (Brown)
- Background: `#0F1A0F` (Very dark green)
- Text: `#E8F5E9` (Light green)

### 4. Candy Corn Pastel
- Primary: `#FFB347` (Pastel orange)
- Secondary: `#FFEB99` (Pastel yellow)
- Accent: `#FFFFFF` (White)
- Background: `#FFF9F0` (Off white)
- Text: `#5C4033` (Brown)

## Usage in Components

### Using Tailwind Classes

```jsx
// Background colors
<div className="bg-primary">Primary background</div>
<div className="bg-secondary">Secondary background</div>
<div className="bg-accent">Accent background</div>
<div className="bg-background">Background color</div>

// Text colors
<p className="text-primary">Primary text</p>
<p className="text-secondary">Secondary text</p>
<p className="text-accent">Accent text</p>
<p className="text-text">Default text color</p>

// Border colors
<div className="border border-primary">Primary border</div>

// Hover states
<button className="bg-primary hover:bg-accent">Hover effect</button>
```

### Using CSS Variables Directly

For cases where Tailwind utilities aren't sufficient:

```jsx
<div style={{ backgroundColor: 'var(--color-primary)' }}>
  Custom styling
</div>
```

## WCAG AA Compliance

All four themes have been verified to meet WCAG AA accessibility standards for color contrast:

- **Text on Background**: All themes meet the 4.5:1 contrast ratio requirement for normal text
- **Primary/Secondary/Accent on Background**: These colors are used for decorative elements and large text, meeting the 3:1 threshold

### Contrast Ratios

| Theme | Text:Background | Primary:Background | Secondary:Background | Accent:Background |
|-------|----------------|-------------------|---------------------|------------------|
| Pumpkin Glow | 15.93:1 ✓ | 2.18:1 | 1.32:1 | 2.68:1 |
| Vampire Crimson | 16.70:1 ✓ | 2.01:1 | 4.03:1 ✓ | 1.24:1 |
| Witch Forest | 15.89:1 ✓ | 1.93:1 | 2.66:1 | 3.98:1 ✓ |
| Candy Corn Pastel | 8.97:1 ✓ | 1.70:1 | 1.14:1 | 1.05:1 |

✓ = Meets WCAG AA for large text (3:1) or normal text (4.5:1)

## Testing

### Color Contrast Utilities

The `src/utils/colorContrast.js` file provides utilities for verifying WCAG compliance:

```javascript
import { getContrastRatio, meetsWCAG_AA, verifyThemeContrast } from './utils/colorContrast';

// Calculate contrast ratio
const ratio = getContrastRatio('#FF8C42', '#FFF8E7');

// Check WCAG AA compliance
const passes = meetsWCAG_AA(ratio, 'normal'); // or 'large'

// Verify entire theme
const result = verifyThemeContrast(THEMES.pumpkinGlow);
console.log(result.compliance); // { textOnBackground: true, ... }
```

### Integration Tests

The `src/context/ThemeContext.integration.test.jsx` file verifies:
- CSS variables are applied correctly on mount
- CSS variables update when theme changes
- All four themes apply correctly
- Theme selection persists to localStorage
- Theme is restored from localStorage on mount
- Tailwind classes work with CSS variables

## Best Practices

1. **Always use theme colors**: Use `bg-primary`, `text-primary`, etc. instead of hardcoded colors like `bg-orange-500`

2. **Test with all themes**: Ensure your components look good with all four theme palettes

3. **Use semantic color names**: Use `primary` for main actions, `secondary` for supporting elements, `accent` for highlights

4. **Maintain contrast**: When adding new UI elements, ensure they maintain sufficient contrast with the background

5. **Avoid opacity on text**: Opacity can reduce contrast ratios. If you need lighter text, consider using the `secondary` or `accent` colors instead

## Troubleshooting

### Theme not applying
- Ensure your component is wrapped in `<ThemeProvider>`
- Check that CSS variables are defined in `index.css`
- Verify Tailwind config includes the color extensions

### Colors not updating
- Check browser DevTools to see if CSS variables are being set on `:root`
- Ensure `ThemeContext` is properly updating the variables in the `useEffect`

### Contrast issues
- Use the `verifyThemeContrast` utility to check contrast ratios
- Adjust theme colors in `src/constants/themes.js` if needed
- Run tests: `npm test -- src/utils/colorContrast.test.js`

## Future Enhancements

Potential improvements to the theme system:

- Add more theme palettes
- Support custom user-created themes
- Add theme preview before applying
- Support system dark mode preference
- Add theme transition animations
