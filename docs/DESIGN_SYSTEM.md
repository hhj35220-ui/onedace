# OnePlace Enterprise — Design System

## Overview
This design system centralizes tokens, components, icons, themes and accessibility best practices.

## Files
- `/css/design-tokens.css` — CSS custom properties (colors, spacing, radii, shadows, z-index, motion)
- `/css/design-core.css` — base typography, resets, utilities
- `/css/design-components.css` — reusable component styles
- `/js/design-system.js` — `window.OP.design` manager (component registry, theme API)
- `/js/icons.js` — icon manager, lazy loads `/assets/icons.svg`
- `/assets/icons.svg` — SVG sprite

## Public API
`window.OP.design` methods:
- `init()` — initialize design system
- `destroy()` — teardown
- `refresh()` — refresh tokens/hooks
- `registerComponent(name, factory)` — register component factory
- `unregisterComponent(name)` — remove component
- `getComponent(name)` — get registered factory
- `getComponents()` — list registered names
- `getTokens()` — read CSS tokens
- `theme()` / `getCurrentTheme()` — read current theme
- `setTheme(theme)` — 'light'|'dark'
- `toggleTheme()`
- `refreshComponents()` — call registered refresh hooks

## Design Tokens
Tokens provided via CSS variables in `design-tokens.css`. Use `getComputedStyle(document.documentElement)` or `window.OP.design.getTokens()` to read at runtime.

## Icon Registry
Icons are stored in `/assets/icons.svg` and injected into the DOM on init. Use `window.OP.icons.icon('name')` to get an SVG markup string.

## Accessibility
- Components are keyboard navigable and include focus styles.
- Reduced motion respected via `prefers-reduced-motion`.
- Minimum touch targets and ARIA roles applied in JS components where necessary.

## Performance
- CSS files are loaded once via `<link>`; JS is lazy-loaded via `app.js`.
- SVG sprite is fetched and injected once.
- Components should register once to avoid duplicates.

## Migration
- Design system is purely frontend; backend integration is not required. Store design preferences in `localStorage` using key `op_design_theme`.

*** End of document
