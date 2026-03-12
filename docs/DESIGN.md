# Design System

## Overview

Style guide and visual patterns for the project. Based on TailwindCSS v4.

---

## Color Palette

### Primary Colors

```
--color-primary: #46bca0
--color-primary-hover: #3aa88e
--color-primary-light: #7dd9c4
--color-primary-dark: #2d8a72
```

### Secondary Colors

```
--color-secondary: #f7c948
--color-secondary-hover: #e5b63a
--color-secondary-light: #f9dc7d
--color-secondary-dark: #d4a830
```

### Tertiary Colors

```
--color-tertiary: #f25c54
--color-tertiary-hover: #e04842
--color-tertiary-light: #f78a85
--color-tertiary-dark: #d9443e
```

### Quaternary Colors

```
--color-quaternary: #131317
--color-quaternary-light: #2a2a35
--color-quaternary-muted: #6b6b7a
```

### Neutrals

```
--color-white: #ffffff
--color-gray-50: #f9fafb
--color-gray-100: #f3f4f6
--color-gray-200: #e5e7eb
--color-gray-300: #d1d5db
--color-gray-400: #9ca3af
--color-gray-500: #6b7280
--color-gray-600: #4b5563
--color-gray-700: #374151
--color-gray-800: #1f2937
--color-gray-900: #111827
```

### Semantic Colors

```
--color-success: #10b981
--color-warning: #f59e0b
--color-error: #ef4444
--color-info: #3b82f6
```

---

## Typography

### Font Families

```
--font-sans: 'Inter', system-ui, -apple-system, sans-serif
--font-display: 'Poppins', sans-serif
```

### Font Sizes

```
--text-xs: 0.75rem      (12px)
--text-sm: 0.875rem     (14px)
--text-base: 1rem       (16px)
--text-lg: 1.125rem     (18px)
--text-xl: 1.25rem      (20px)
--text-2xl: 1.5rem      (24px)
--text-3xl: 1.875rem    (30px)
--text-4xl: 2.25rem     (36px)
--text-5xl: 3rem        (48px)
```

### Font Weights

```
--font-light: 300
--font-normal: 400
--font-medium: 500
--font-semibold: 600
--font-bold: 700
```

### Line Heights

```
--leading-tight: 1.25
--leading-normal: 1.5
--leading-relaxed: 1.75
```

---

## Spacing

```
--space-0: 0
--space-1: 0.25rem    (4px)
--space-2: 0.5rem     (8px)
--space-3: 0.75rem    (12px)
--space-4: 1rem       (16px)
--space-5: 1.25rem    (20px)
--space-6: 1.5rem     (24px)
--space-8: 2rem       (32px)
--space-10: 2.5rem    (40px)
--space-12: 3rem      (48px)
--space-16: 4rem      (64px)
--space-20: 5rem      (80px)
--space-24: 6rem      (96px)
```

---

## Border Radius

```
--radius-none: 0
--radius-sm: 0.125rem    (2px)
--radius: 0.25rem        (4px)
--radius-md: 0.375rem    (6px)
--radius-lg: 0.5rem      (8px)
--radius-xl: 0.75rem     (12px)
--radius-2xl: 1rem       (16px)
--radius-full: 9999px
```

---

## Shadows

```
--shadow-sm: 0 1px 2px 0 rgb(0 0 0 / 0.05)
--shadow: 0 1px 3px 0 rgb(0 0 0 / 0.1), 0 1px 2px -1px rgb(0 0 0 / 0.1)
--shadow-md: 0 4px 6px -1px rgb(0 0 0 / 0.1), 0 2px 4px -2px rgb(0 0 0 / 0.1)
--shadow-lg: 0 10px 15px -3px rgb(0 0 0 / 0.1), 0 4px 6px -4px rgb(0 0 0 / 0.1)
--shadow-xl: 0 20px 25px -5px rgb(0 0 0 / 0.1), 0 8px 10px -6px rgb(0 0 0 / 0.1)
```

---

## Breakpoints

```
sm: 640px
md: 768px
lg: 1024px
xl: 1280px
2xl: 1536px
```

### Responsive Patterns

```
Mobile First: use min-width
Mobile: < 640px
Tablet: 640px - 1024px
Desktop: > 1024px
```

---

## Components

### Buttons

#### Primary Button

```
background: primary
text: white
padding: 12px 24px
border-radius: lg
font-weight: 600
hover: primary-hover
transition: all 200ms
```

#### Secondary Button

```
background: transparent
border: 2px solid primary
text: primary
padding: 10px 22px
hover: bg-primary/10
```

#### Danger Button

```
background: error
text: white
padding: 12px 24px
hover: error/90
```

### Inputs

```
height: 44px
padding: 0 16px
border: 1px solid gray-300
border-radius: lg
font-size: base
focus: ring-2 ring-primary/50, border-primary
placeholder: gray-400
```

### Cards

```
background: white
border-radius: xl
shadow: md
padding: 24px
```

### Badges

```
padding: 4px 12px
border-radius: full
font-size: sm
font-weight: 500

Variants:
- success: bg-success/10 text-success
- warning: bg-warning/10 text-warning
- error: bg-error/10 text-error
- info: bg-info/10 text-info
```

### Loading Spinner

```
size: 24px
border: 2px solid gray-200
border-top: 2px solid primary
border-radius: full
animation: spin 0.8s linear infinite
```

---

## Animations

### Transitions

```
transition: all 200ms ease-in-out
transition: all 300ms ease-in-out
```

### Keyframes

```css
@keyframes fadeIn {
  from { opacity: 0; }
  to { opacity: 1; }
}

@keyframes slideUp {
  from { transform: translateY(20px); opacity: 0; }
  to { transform: translateY(0); opacity: 1; }
}

@keyframes slideDown {
  from { transform: translateY(-20px); opacity: 0; }
  to { transform: translateY(0); opacity: 1; }
}

@keyframes scaleIn {
  from { transform: scale(0.95); opacity: 0; }
  to { transform: scale(1); opacity: 1; }
}

@keyframes spin {
  to { transform: rotate(360deg); }
}
```

### Motion Usage

```jsx
import { motion } from 'motion/react'

// Fade in
<motion.div
  initial={{ opacity: 0 }}
  animate={{ opacity: 1 }}
  transition={{ duration: 0.3 }}
/>

// Slide up
<motion.div
  initial={{ y: 20, opacity: 0 }}
  animate={{ y: 0, opacity: 1 }}
  transition={{ duration: 0.3 }}
/>

// Scale in
<motion.div
  initial={{ scale: 0.95, opacity: 0 }}
  animate={{ scale: 1, opacity: 1 }}
  transition={{ duration: 0.2 }}
/>
```

---

## States

### Hover

```
Buttons: brightness reduction or color shift
Cards: shadow-lg, translateY(-2px)
Links: underline
```

### Active

```
Buttons: scale(0.98)
Links: text-primary-dark
```

### Disabled

```
opacity: 0.5
cursor: not-allowed
pointer-events: none
```

### Focus

```
outline: none
ring: 2px solid primary/50
ring-offset: 2px
```

---

## Empty States

### Structure

```
- Icon (48px, muted color)
- Title (text-xl, semibold)
- Description (text-base, muted)
- Optional: Action button
```

### Examples

```
// No products
Icon: Package
Title: No products
Description: No products available in this category.

// No results
Icon: Search
Title: No results
Description: We could not find what you were looking for.
```

---

## Layout Patterns

### Container

```
max-width: 1280px
margin: 0 auto
padding: 0 16px (mobile), 0 24px (tablet), 0 48px (desktop)
```

### Grid

```
Grid columns: 1 (mobile), 2 (tablet), 3-4 (desktop)
Gap: 16px (mobile), 24px (desktop)
```

### Section Spacing

```
Section padding: 48px 0 (mobile), 80px 0 (desktop)
Section margin-bottom: 48px
```

---

## Z-Index Scale

```
z-0: 0
z-10: 10
z-20: 20
z-30: 30
z-40: 40
z-50: 50
z-modal: 100
z-toast: 200
```
