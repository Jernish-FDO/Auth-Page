---
name: ui-ux-design
description: >
  Design and implement exceptional UI/UX for web and mobile applications. Use this skill
  whenever the user asks about design systems, component libraries, layout, typography,
  color, spacing, accessibility, user flows, wireframes, prototypes, responsive design,
  dark mode, micro-interactions, animations, onboarding, forms, navigation patterns,
  dashboards, landing pages, or improving the look and feel of any interface.
  Also trigger for questions like "how should I design X", "make this look better",
  "improve the UX of", "what's the best pattern for", "is my design accessible",
  or any request about user experience, usability, or visual design — even if the word
  "UI" or "UX" is never used. If the user is building something people will interact with,
  this skill is relevant.
---

# UI/UX Design Skill

A comprehensive guide for designing and implementing beautiful, accessible, and
highly usable interfaces — from first principles to production-ready code.

---

## Quick Decision Tree

| What the user needs | Jump to |
|---|---|
| Design system / tokens setup | [Design Tokens & Systems](#1-design-tokens--systems) |
| Colors, typography, spacing | [Visual Foundations](#2-visual-foundations) |
| Layout & responsive design | [Layout Patterns](#3-layout-patterns) |
| Components (buttons, forms, cards) | [Component Patterns](#4-component-patterns) |
| Motion & micro-interactions | [Motion Design](#5-motion--micro-interactions) |
| Accessibility (a11y) | [Accessibility](#6-accessibility-a11y) |
| User flows & information architecture | [UX Patterns](#7-ux-patterns--information-architecture) |
| Dark mode | [Theming & Dark Mode](#8-theming--dark-mode) |
| Design critique / feedback | [Design Review Checklist](#9-design-review-checklist) |

---

## 1. Design Tokens & Systems

Design tokens are the single source of truth for all visual decisions. Define them first.

### CSS Custom Properties (universal)

```css
:root {
  /* === COLOR === */
  --color-brand-50:  #eff6ff;
  --color-brand-500: #3b82f6;
  --color-brand-900: #1e3a8a;

  --color-neutral-0:   #ffffff;
  --color-neutral-50:  #f8fafc;
  --color-neutral-100: #f1f5f9;
  --color-neutral-500: #64748b;
  --color-neutral-900: #0f172a;

  --color-success: #22c55e;
  --color-warning: #f59e0b;
  --color-danger:  #ef4444;
  --color-info:    #06b6d4;

  /* === TYPOGRAPHY === */
  --font-display: 'Fraunces', Georgia, serif;       /* Headlines */
  --font-body:    'DM Sans', system-ui, sans-serif; /* Body text */
  --font-mono:    'JetBrains Mono', monospace;      /* Code */

  --text-xs:   0.75rem;   /* 12px */
  --text-sm:   0.875rem;  /* 14px */
  --text-base: 1rem;      /* 16px */
  --text-lg:   1.125rem;  /* 18px */
  --text-xl:   1.25rem;   /* 20px */
  --text-2xl:  1.5rem;    /* 24px */
  --text-3xl:  1.875rem;  /* 30px */
  --text-4xl:  2.25rem;   /* 36px */
  --text-5xl:  3rem;      /* 48px */

  --leading-tight:  1.25;
  --leading-normal: 1.5;
  --leading-relaxed: 1.75;

  /* === SPACING (4px base unit) === */
  --space-1:  0.25rem;  /* 4px */
  --space-2:  0.5rem;   /* 8px */
  --space-3:  0.75rem;  /* 12px */
  --space-4:  1rem;     /* 16px */
  --space-6:  1.5rem;   /* 24px */
  --space-8:  2rem;     /* 32px */
  --space-12: 3rem;     /* 48px */
  --space-16: 4rem;     /* 64px */
  --space-24: 6rem;     /* 96px */

  /* === BORDERS === */
  --radius-sm: 0.25rem;
  --radius-md: 0.5rem;
  --radius-lg: 0.75rem;
  --radius-xl: 1rem;
  --radius-full: 9999px;

  --border-thin:   1px;
  --border-normal: 2px;
  --border-thick:  4px;

  /* === SHADOWS === */
  --shadow-sm:  0 1px 2px 0 rgb(0 0 0 / 0.05);
  --shadow-md:  0 4px 6px -1px rgb(0 0 0 / 0.1), 0 2px 4px -2px rgb(0 0 0 / 0.1);
  --shadow-lg:  0 10px 15px -3px rgb(0 0 0 / 0.1), 0 4px 6px -4px rgb(0 0 0 / 0.1);
  --shadow-xl:  0 20px 25px -5px rgb(0 0 0 / 0.1), 0 8px 10px -6px rgb(0 0 0 / 0.1);

  /* === MOTION === */
  --duration-fast:   100ms;
  --duration-normal: 200ms;
  --duration-slow:   400ms;
  --ease-out: cubic-bezier(0.16, 1, 0.3, 1);
  --ease-in-out: cubic-bezier(0.87, 0, 0.13, 1);
  --ease-spring: cubic-bezier(0.34, 1.56, 0.64, 1);

  /* === Z-INDEX SCALE === */
  --z-base:    0;
  --z-raised:  10;
  --z-dropdown: 100;
  --z-sticky:  200;
  --z-overlay: 300;
  --z-modal:   400;
  --z-toast:   500;
}
```

### Tailwind Config (if using Tailwind)

```js
// tailwind.config.js
module.exports = {
  theme: {
    extend: {
      fontFamily: {
        display: ['Fraunces', 'Georgia', 'serif'],
        body: ['DM Sans', 'system-ui', 'sans-serif'],
        mono: ['JetBrains Mono', 'monospace'],
      },
      colors: {
        brand: { 50: '#eff6ff', 500: '#3b82f6', 900: '#1e3a8a' },
      },
      animation: {
        'fade-in': 'fadeIn 0.4s var(--ease-out)',
        'slide-up': 'slideUp 0.4s var(--ease-out)',
      },
    },
  },
};
```

---

## 2. Visual Foundations

### Typography Rules

```
DO:
✅ Use max 2 typefaces per project (display + body)
✅ Body text: 16px minimum, 1.5–1.75 line-height
✅ Limit line length: 60–75 characters (45–85 acceptable)
✅ Use optical sizing for large headings (font-optical-sizing: auto)
✅ Establish a clear typographic hierarchy: 5 levels max

DON'T:
❌ Use system fonts for display/headline text
❌ Set body text below 14px
❌ Use all-caps for more than 5 words
❌ Justify text (creates rivers of whitespace)
❌ Use light weights (300) at small sizes
```

**Typographic scale (Major Third — 1.25 ratio):**

```css
.text-hero    { font-size: clamp(2.5rem, 6vw, 4rem); line-height: 1.1; }
.text-h1      { font-size: clamp(2rem, 4vw, 3rem);   line-height: 1.15; }
.text-h2      { font-size: clamp(1.5rem, 3vw, 2rem); line-height: 1.25; }
.text-h3      { font-size: 1.25rem;  line-height: 1.35; }
.text-body    { font-size: 1rem;     line-height: 1.65; }
.text-small   { font-size: 0.875rem; line-height: 1.5; }
.text-caption { font-size: 0.75rem;  line-height: 1.4; }
```

### Color Rules

```
The 60-30-10 Rule:
  60% — Dominant / background (neutral)
  30% — Secondary / surfaces (slightly elevated)
  10% — Accent / brand / CTA

Contrast Minimums (WCAG 2.1):
  Normal text:  4.5:1 ratio
  Large text:   3:1 ratio
  UI components: 3:1 ratio
  
Color meanings (be consistent):
  Blue   → Primary actions, links, info
  Green  → Success, positive, complete
  Yellow → Warning, caution, pending
  Red    → Danger, error, destructive
  Gray   → Disabled, secondary, inactive
```

### Spacing Rules

Always use the **4px base grid**. Never use arbitrary values.

```
Micro spacing (within components):  4, 8, 12px
Component spacing (between elements): 16, 24px
Section spacing (between components): 32, 48px
Layout spacing (between sections): 64, 96px
```

---

## 3. Layout Patterns

### Responsive Breakpoints

```css
/* Mobile-first breakpoints */
/* sm  */ @media (min-width: 640px)  { }
/* md  */ @media (min-width: 768px)  { }
/* lg  */ @media (min-width: 1024px) { }
/* xl  */ @media (min-width: 1280px) { }
/* 2xl */ @media (min-width: 1536px) { }

/* Container widths */
.container {
  width: 100%;
  margin-inline: auto;
  padding-inline: clamp(1rem, 5vw, 2rem);
  max-width: 1280px;
}

/* Prose container */
.prose { max-width: 65ch; }
```

### Common Layout Patterns

**Sidebar + Main (Dashboard):**
```css
.layout-dashboard {
  display: grid;
  grid-template-columns: 260px 1fr;
  grid-template-rows: auto 1fr;
  min-height: 100vh;
}

@media (max-width: 768px) {
  .layout-dashboard {
    grid-template-columns: 1fr;
  }
}
```

**Holy Grail (Header + Sidebar + Content + Sidebar + Footer):**
```css
.holy-grail {
  display: grid;
  grid-template:
    "header  header  header"  auto
    "nav     main    aside"   1fr
    "footer  footer  footer"  auto
    / 200px  1fr     200px;
  min-height: 100vh;
}
```

**Card Grid (auto-responsive — no media queries needed):**
```css
.card-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
  gap: var(--space-6);
}
```

**Stack (vertical rhythm):**
```css
.stack > * + * { margin-top: var(--space-4); }
.stack-lg > * + * { margin-top: var(--space-8); }
```

---

## 4. Component Patterns

### Buttons

```css
/* Base */
.btn {
  display: inline-flex;
  align-items: center;
  gap: var(--space-2);
  padding: var(--space-2) var(--space-4);
  font-size: var(--text-sm);
  font-weight: 500;
  border-radius: var(--radius-md);
  border: var(--border-thin) solid transparent;
  cursor: pointer;
  transition: all var(--duration-normal) var(--ease-out);
  text-decoration: none;
  white-space: nowrap;

  /* Accessibility: visible focus ring */
  &:focus-visible {
    outline: 2px solid var(--color-brand-500);
    outline-offset: 2px;
  }

  /* Disabled */
  &:disabled {
    opacity: 0.5;
    cursor: not-allowed;
    pointer-events: none;
  }
}

/* Variants */
.btn-primary {
  background: var(--color-brand-500);
  color: white;
  &:hover { background: var(--color-brand-600); transform: translateY(-1px); }
  &:active { transform: translateY(0); }
}

.btn-secondary {
  background: var(--color-neutral-100);
  color: var(--color-neutral-900);
  &:hover { background: var(--color-neutral-200); }
}

.btn-ghost {
  background: transparent;
  color: var(--color-neutral-700);
  &:hover { background: var(--color-neutral-100); }
}

.btn-danger {
  background: var(--color-danger);
  color: white;
  &:hover { background: #dc2626; }
}

/* Sizes */
.btn-sm { padding: var(--space-1) var(--space-3); font-size: var(--text-xs); }
.btn-lg { padding: var(--space-3) var(--space-6); font-size: var(--text-base); }
```

### Form Inputs

```css
.input {
  width: 100%;
  padding: var(--space-2) var(--space-3);
  font-size: var(--text-base);
  border: var(--border-thin) solid var(--color-neutral-300);
  border-radius: var(--radius-md);
  background: var(--color-neutral-0);
  color: var(--color-neutral-900);
  transition: border-color var(--duration-fast) var(--ease-out),
              box-shadow var(--duration-fast) var(--ease-out);

  &::placeholder { color: var(--color-neutral-400); }

  &:hover  { border-color: var(--color-neutral-400); }

  &:focus {
    outline: none;
    border-color: var(--color-brand-500);
    box-shadow: 0 0 0 3px rgb(59 130 246 / 0.2);
  }

  &[aria-invalid="true"] {
    border-color: var(--color-danger);
    &:focus { box-shadow: 0 0 0 3px rgb(239 68 68 / 0.2); }
  }
}

/* Field wrapper */
.field { display: flex; flex-direction: column; gap: var(--space-1); }
.field-label { font-size: var(--text-sm); font-weight: 500; color: var(--color-neutral-700); }
.field-hint  { font-size: var(--text-sm); color: var(--color-neutral-500); }
.field-error { font-size: var(--text-sm); color: var(--color-danger); }
```

### Cards

```css
.card {
  background: var(--color-neutral-0);
  border: var(--border-thin) solid var(--color-neutral-200);
  border-radius: var(--radius-lg);
  padding: var(--space-6);
  box-shadow: var(--shadow-sm);
  transition: box-shadow var(--duration-normal) var(--ease-out),
              transform var(--duration-normal) var(--ease-out);

  /* Interactive card */
  &.card-interactive {
    cursor: pointer;
    &:hover {
      box-shadow: var(--shadow-md);
      transform: translateY(-2px);
    }
  }
}
```

### Toast / Notification

```css
.toast {
  display: flex;
  align-items: center;
  gap: var(--space-3);
  padding: var(--space-3) var(--space-4);
  border-radius: var(--radius-lg);
  box-shadow: var(--shadow-lg);
  font-size: var(--text-sm);
  max-width: 380px;
  animation: slideInRight var(--duration-slow) var(--ease-out);
}

@keyframes slideInRight {
  from { transform: translateX(100%); opacity: 0; }
  to   { transform: translateX(0);    opacity: 1; }
}
```

### Skeleton Loaders

```css
.skeleton {
  background: linear-gradient(
    90deg,
    var(--color-neutral-100) 25%,
    var(--color-neutral-200) 50%,
    var(--color-neutral-100) 75%
  );
  background-size: 200% 100%;
  animation: shimmer 1.5s infinite;
  border-radius: var(--radius-md);
}

@keyframes shimmer {
  from { background-position: 200% 0; }
  to   { background-position: -200% 0; }
}

/* Usage */
.skeleton-text  { height: 1em; width: 80%; }
.skeleton-title { height: 1.5em; width: 50%; }
.skeleton-avatar { width: 40px; height: 40px; border-radius: var(--radius-full); }
```

---

## 5. Motion & Micro-interactions

### Core Animation Principles

```
1. PURPOSE — Every animation must have a reason
   - Confirm an action (button press)
   - Show state change (loading → done)
   - Guide attention (highlight new item)
   - Provide spatial context (modal slides in from trigger)

2. DURATION
   - Instant feedback (hover, active):  100ms
   - UI transitions (panels, dropdowns): 200ms
   - Page transitions, modals:           300–400ms
   - Decorative / ambient:               500ms+

3. EASING
   - Things entering: ease-out (starts fast, slows down)
   - Things leaving:  ease-in  (starts slow, speeds up)
   - Springy/playful: cubic-bezier(0.34, 1.56, 0.64, 1)
   - NEVER: linear (feels robotic)

4. REDUCE MOTION — Always respect user preference:
   @media (prefers-reduced-motion: reduce) {
     *, *::before, *::after {
       animation-duration: 0.01ms !important;
       transition-duration: 0.01ms !important;
     }
   }
```

### Essential Animations

```css
/* Page / component entry */
@keyframes fadeInUp {
  from { opacity: 0; transform: translateY(16px); }
  to   { opacity: 1; transform: translateY(0); }
}

/* Staggered list reveal */
.list-item { animation: fadeInUp var(--duration-slow) var(--ease-out) both; }
.list-item:nth-child(1) { animation-delay: 0ms; }
.list-item:nth-child(2) { animation-delay: 60ms; }
.list-item:nth-child(3) { animation-delay: 120ms; }
.list-item:nth-child(4) { animation-delay: 180ms; }

/* Pulse (for live indicators, badges) */
@keyframes pulse {
  0%, 100% { opacity: 1; }
  50%       { opacity: 0.5; }
}

/* Scale in (for modals, popovers) */
@keyframes scaleIn {
  from { opacity: 0; transform: scale(0.95); }
  to   { opacity: 1; transform: scale(1); }
}
```

### React: Framer Motion Patterns

```jsx
import { motion, AnimatePresence } from 'framer-motion';

// Page transition
const pageVariants = {
  initial: { opacity: 0, y: 20 },
  animate: { opacity: 1, y: 0, transition: { duration: 0.4, ease: [0.16, 1, 0.3, 1] } },
  exit:    { opacity: 0, y: -20 },
};

export function Page({ children }) {
  return (
    <motion.div variants={pageVariants} initial="initial" animate="animate" exit="exit">
      {children}
    </motion.div>
  );
}

// Staggered list
const containerVariants = {
  animate: { transition: { staggerChildren: 0.06 } },
};
const itemVariants = {
  initial: { opacity: 0, y: 16 },
  animate: { opacity: 1, y: 0 },
};

export function AnimatedList({ items }) {
  return (
    <motion.ul variants={containerVariants} initial="initial" animate="animate">
      {items.map(item => (
        <motion.li key={item.id} variants={itemVariants}>{item.label}</motion.li>
      ))}
    </motion.ul>
  );
}

// Modal with AnimatePresence
export function Modal({ isOpen, onClose, children }) {
  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
          className="overlay" onClick={onClose}
        >
          <motion.div
            initial={{ scale: 0.95, opacity: 0 }}
            animate={{ scale: 1,    opacity: 1 }}
            exit={{    scale: 0.95, opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="modal" onClick={e => e.stopPropagation()}
          >
            {children}
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
```

---

## 6. Accessibility (a11y)

Accessibility is not optional. These are non-negotiable minimums.

### Checklist

```
KEYBOARD NAVIGATION
✅ All interactive elements reachable via Tab
✅ Focus order follows visual reading order
✅ Focus ring visible (never outline: none without replacement)
✅ Modals trap focus while open; restore focus on close
✅ Escape key closes modals, dropdowns, toasts

SEMANTIC HTML
✅ Use <button> for actions, <a> for navigation
✅ Heading hierarchy: h1 → h2 → h3 (no skipping)
✅ Form inputs have associated <label> (via htmlFor / for)
✅ Lists use <ul>/<ol>/<li>
✅ Images have descriptive alt text (decorative: alt="")

ARIA (only when HTML semantics are insufficient)
✅ role="dialog" + aria-modal="true" on modals
✅ aria-label on icon-only buttons
✅ aria-expanded on toggles (accordions, menus)
✅ aria-invalid="true" + aria-describedby on error inputs
✅ aria-live="polite" for dynamic status messages
✅ aria-busy="true" on loading regions

COLOR & CONTRAST
✅ Normal text: 4.5:1 minimum contrast
✅ Large text (18px+): 3:1 minimum
✅ Never use color as the only differentiator
✅ Test with grayscale filter

MOTION
✅ Respect prefers-reduced-motion
✅ No content flashes more than 3 times/second
```

### Accessible Form Pattern

```jsx
export function FormField({ id, label, hint, error, ...inputProps }) {
  return (
    <div className="field">
      <label htmlFor={id} className="field-label">
        {label}
        {inputProps.required && <span aria-hidden="true"> *</span>}
      </label>

      {hint && <p id={`${id}-hint`} className="field-hint">{hint}</p>}

      <input
        id={id}
        aria-describedby={[hint && `${id}-hint`, error && `${id}-error`]
          .filter(Boolean).join(' ')}
        aria-invalid={error ? 'true' : undefined}
        aria-required={inputProps.required}
        className="input"
        {...inputProps}
      />

      {error && (
        <p id={`${id}-error`} role="alert" className="field-error">
          {error}
        </p>
      )}
    </div>
  );
}
```

### Accessible Modal

```jsx
import { useEffect, useRef } from 'react';

export function Modal({ isOpen, onClose, title, children }) {
  const modalRef = useRef(null);
  const previousFocus = useRef(null);

  useEffect(() => {
    if (isOpen) {
      previousFocus.current = document.activeElement;
      modalRef.current?.focus();
    } else {
      previousFocus.current?.focus(); // Restore focus on close
    }
  }, [isOpen]);

  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape') onClose();
    };
    if (isOpen) document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return (
    <div role="presentation" style={{ position: 'fixed', inset: 0, zIndex: 'var(--z-modal)' }}>
      {/* Backdrop */}
      <div aria-hidden="true" onClick={onClose}
        style={{ position: 'absolute', inset: 0, background: 'rgb(0 0 0 / 0.5)' }} />

      {/* Modal */}
      <div
        ref={modalRef}
        role="dialog"
        aria-modal="true"
        aria-labelledby="modal-title"
        tabIndex={-1}
        className="modal"
      >
        <h2 id="modal-title">{title}</h2>
        {children}
        <button onClick={onClose} aria-label="Close dialog">✕</button>
      </div>
    </div>
  );
}
```

---

## 7. UX Patterns & Information Architecture

### Navigation Patterns

| Pattern | When to use |
|---|---|
| Top navbar | Marketing sites, <5 main sections |
| Sidebar nav | Apps with 5–15 sections, dashboard |
| Bottom tab bar | Mobile apps with 3–5 sections |
| Breadcrumbs | Deep hierarchies (3+ levels) |
| Hamburger menu | Mobile-only, always label it |

### Empty States

Every list, table, or feed needs an empty state. Never show a blank screen.

```jsx
export function EmptyState({ icon, title, description, action }) {
  return (
    <div style={{ textAlign: 'center', padding: 'var(--space-16) var(--space-8)' }}>
      <div aria-hidden="true" style={{ fontSize: '3rem', marginBottom: 'var(--space-4)' }}>
        {icon}
      </div>
      <h3 style={{ fontSize: 'var(--text-lg)', fontWeight: 600 }}>{title}</h3>
      <p style={{ color: 'var(--color-neutral-500)', marginTop: 'var(--space-2)' }}>
        {description}
      </p>
      {action && <div style={{ marginTop: 'var(--space-6)' }}>{action}</div>}
    </div>
  );
}
```

### Loading States — Priority Order

```
1. Skeleton screens  — Best: preserve layout, reduce perceived wait
2. Spinner           — OK for small components or short waits (<1s)
3. Progress bar      — Best for known-duration tasks (file upload)
4. Optimistic UI     — Best: update immediately, rollback on error
5. Blank screen      — Never acceptable
```

### Error States

```
Hierarchy of error handling:
1. Prevent the error   — Disable submit until form is valid
2. Inline validation   — Show error next to the field, immediately
3. Toast notification  — For async/background errors
4. Error page          — Only for unrecoverable errors (404, 500)

Error message formula:
  ❌ "Error 422" / "Something went wrong"
  ✅ "[What happened] + [Why] + [What to do next]"
  Example: "Couldn't save changes. Your session expired. Please sign in again."
```

### Onboarding Patterns

```
Progressive disclosure:
  → Show only what's needed for the current step
  → Reveal complexity as the user advances

Checklist onboarding (best for complex apps):
  □ Connect your account
  □ Import your first item
  □ Invite a teammate
  → Show completion percentage, celebrate milestones

Tooltips vs. Walkthroughs:
  → Tooltips: passive hints for power users
  → Walkthroughs: active guidance for first-time users
  → Always provide a "skip" option
```

---

## 8. Theming & Dark Mode

### CSS-Variables-based theming

```css
/* Light (default) */
:root {
  --bg-primary:   #ffffff;
  --bg-secondary: #f8fafc;
  --bg-elevated:  #f1f5f9;
  --border-color: #e2e8f0;
  --text-primary:   #0f172a;
  --text-secondary: #475569;
  --text-muted:     #94a3b8;
}

/* Dark */
[data-theme="dark"],
@media (prefers-color-scheme: dark) {
  :root {
    --bg-primary:   #0f172a;
    --bg-secondary: #1e293b;
    --bg-elevated:  #334155;
    --border-color: #334155;
    --text-primary:   #f8fafc;
    --text-secondary: #94a3b8;
    --text-muted:     #64748b;
  }
}
```

### React Theme Toggle

```jsx
import { useState, useEffect } from 'react';

export function useTheme() {
  const [theme, setTheme] = useState(() => {
    return localStorage.getItem('theme') ||
      (window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light');
  });

  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme);
    localStorage.setItem('theme', theme);
  }, [theme]);

  const toggleTheme = () => setTheme(t => t === 'light' ? 'dark' : 'light');

  return { theme, toggleTheme };
}
```

### Dark Mode Rules

```
✅ Use semantic color tokens (--bg-primary, not #ffffff)
✅ Reduce saturation slightly in dark mode
✅ Reduce shadow intensity (dark surfaces don't cast dark shadows)
✅ Test all states: hover, focus, disabled, error
✅ Check images/icons — invert where appropriate

❌ Don't use pure #000000 backgrounds (use #0f172a or similar)
❌ Don't use pure #ffffff text (use #f8fafc)
❌ Don't just invert colors — redesign the palette
```

---

## 9. Design Review Checklist

Use this before shipping any UI:

### Visual
- [ ] Consistent spacing (multiples of 4px)
- [ ] Consistent border-radius across similar components
- [ ] Font hierarchy is clear (3–5 distinct levels)
- [ ] Color palette has ≤3 brand colors + neutrals + semantic
- [ ] All interactive states present: default, hover, focus, active, disabled, loading

### Responsiveness
- [ ] Tested at 375px (mobile), 768px (tablet), 1280px (desktop)
- [ ] No horizontal overflow
- [ ] Touch targets ≥ 44×44px
- [ ] Font sizes don't go below 14px on mobile

### Accessibility
- [ ] Contrast ratios pass (use https://webaim.org/resources/contrastchecker/)
- [ ] Tab order makes sense
- [ ] All images have alt text
- [ ] Errors are announced to screen readers
- [ ] No keyboard traps (except intentional modal focus traps)

### Performance
- [ ] Images use next-gen formats (WebP/AVIF)
- [ ] Images have explicit width/height (prevent layout shift)
- [ ] Fonts are preloaded; FOUT handled
- [ ] Animations are `transform`/`opacity` only (GPU-composited)
- [ ] No layout shifts on load (CLS < 0.1)

### Content
- [ ] Empty states defined for all lists/tables
- [ ] Error states defined for all async operations
- [ ] Loading states defined (skeleton or spinner)
- [ ] All copy is final (no "Lorem ipsum")
- [ ] Truncation handled for long strings

---

## 10. Tools & Resources

### Design Tools
- **Figma** — UI design, prototyping, design systems
- **Storybook** — Component development and documentation
- **Chromatic** — Visual regression testing

### Testing
- **axe DevTools** — Automated accessibility testing
- **WAVE** — Web accessibility evaluation
- **Contrast Checker** — webaim.org/resources/contrastchecker
- **Lighthouse** — Performance, accessibility, SEO audit

### Font Sources
- **Google Fonts** — fonts.google.com (free)
- **Fontshare** — fontshare.com (free, high quality)
- **Klim** — klim.co.nz (premium)

### Icon Libraries
- **Lucide** — lucide.dev (React-friendly)
- **Heroicons** — heroicons.com (Tailwind team)
- **Phosphor** — phosphoricons.com (many styles)
- **Tabler Icons** — tabler.io/icons (1000+ free)

### CSS Utilities
- **Tailwind CSS** — Utility-first CSS framework
- **Open Props** — openprops.style (CSS custom property system)
- **Radix UI** — Unstyled, accessible component primitives
- **shadcn/ui** — Copy-paste accessible components

### Animation
- **Framer Motion** — React animation library
- **GSAP** — Advanced animation (scroll, timeline)
- **Auto-animate** — Zero-config animations (add/remove/move)
