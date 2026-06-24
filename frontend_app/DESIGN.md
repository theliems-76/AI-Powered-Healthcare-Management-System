---
name: Clinical Precision
description: Design System for MediCore Enterprise Healthcare Suite
fontFamily: Inter
---

# Design System Specification: Clinical Precision

## 1. Overview & Brand Identity
The design system is engineered for high-stakes enterprise healthcare environments where clarity, stability, and speed of cognition are paramount. The aesthetic is rooted in **Modern Corporate Minimalism** with a strict adherence to grid-based alignment. It evokes an emotional response of "Clinical Trust".

Key stylistic pillars include:
- **Structural Integrity:** Heavy reliance on clear borders and consistent gutters to compartmentalize complex patient data.
- **Data-First Hierarchy:** Typography and spacing are optimized for density without sacrificing legibility.
- **Zero-Distraction UI:** Elimination of unnecessary gradients, blurs, or motion, ensuring the professional user remains focused on critical diagnostic information.

## 2. Core Colors (Tailwind Tokens)

- **Primary Trust Blue (#0B5CFF):** Used exclusively for primary actions, active states, and essential focal points.
- **Background (#F8FAFC / #faf8ff):** An off-white shade that reduces screen glare during long shifts.
- **Surface (#FFFFFF):** Reserved for "containers of truth"—cards, data tables, and modals.

```yaml
colors:
  primary: '#0046cc'
  primary-container: '#0b5cff'
  on-primary: '#ffffff'
  on-primary-container: '#ecedff'
  
  secondary: '#505f76'
  secondary-container: '#d0e1fb'
  on-secondary: '#ffffff'
  on-secondary-container: '#54647a'

  tertiary: '#9b2d00'
  tertiary-container: '#c53b00'
  
  error: '#ba1a1a'
  error-container: '#ffdad6'
  on-error: '#ffffff'
  on-error-container: '#93000a'

  background: '#faf8ff'
  on-background: '#191b24'
  
  surface: '#faf8ff'
  surface-dim: '#d9d9e6'
  surface-bright: '#faf8ff'
  surface-container-lowest: '#ffffff'
  surface-container-low: '#f3f2ff'
  surface-container: '#ededfa'
  surface-container-high: '#e7e7f4'
  surface-container-highest: '#e1e1ef'
  
  on-surface: '#191b24'
  on-surface-variant: '#434656'
  
  outline: '#737688'
  outline-variant: '#c3c5d9'
```

## 3. Typography
We use **Inter** for exceptional legibility and a systematic appearance.

- **Scale:** A tight scale ensures large volumes of patient information remain visible.
- **Data Display:** Use monospaced font (JetBrains Mono) for clinical values.

## 4. Components

### Elevation & Depth
Depth is communicated through **Tonal Layering** and **Subtle Outlines** rather than heavy shadows.
- **Layer 0 (Background):** #faf8ff
- **Layer 1 (Surfaces):** #ffffff with a 1px border (#e2e8f0 or outline-variant).

### Shapes
The shape language is "Soft" (0.25rem / 4px) to provide a modern feel while maintaining a disciplined appearance.
- **Component Radius:** 4px (rounded) for buttons, inputs, checkboxes.
- **Container Radius:** 8px (rounded-lg) for main content cards.

### Input Fields
- **Border:** 1px `outline-variant`. On focus, border changes to `primary` with a subtle glow.
- **Labels:** Always visible above the input, using `text-xs font-semibold uppercase tracking-wider`.
- **Error State:** Red border with an explicit icon.
