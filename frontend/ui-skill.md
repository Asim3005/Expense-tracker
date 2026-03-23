# UI Design System - FinTrack

> **Modern SaaS Design System with Clean UI, Soft Colors, and Best UX Practices**

## Design Philosophy

- **Clean & Minimal**: Embrace whitespace, reduce visual noise
- **Soft & Approachable**: Use rounded corners, soft shadows, and gentle colors
- **Purposeful Motion**: Subtle animations that guide, not distract
- **Accessibility First**: High contrast, keyboard navigation, screen reader support
- **Consistent Patterns**: Reusable components with predictable behavior

---

## Color System

### Brand Colors

```css
--primary: 99 102 241;              /* #6366F1 - Modern Indigo */
--primary-foreground: 0 0% 100%;      /* White */
--primary-hover: 95 99 249;          /* #6366F1 with 10% lightness increase */
--primary-active: 91 95 236;          /* #6366F1 with 10% lightness decrease */
```

### Background Colors

```css
--background: 210 100% 98%;          /* #F8FAFC - Very light blue-gray */
--background-muted: 220 20% 96%;      /* #F1F5F9 - Soft gray-blue */
--background-card: 0 0% 100%;         /* #FFFFFF - Pure white */
--background-elevated: 0 0% 100%;     /* #FFFFFF with subtle shadow */
--background-sidebar: 210 100% 98%;    /* #F8FAFC - Matches background */
```

### Text Colors (Hierarchy)

```css
--foreground-primary: 15 23 42;       /* #0F172A - Dark slate (headings, important text) */
--foreground-secondary: 71 85 105;    /* #475569 - Slate gray (body text) */
--foreground-muted: 148 163 184;     /* #94A3B8 - Muted gray (labels, descriptions) */
--foreground-tertiary: 203 213 225;  /* #CBD5E1 - Very light (disabled, placeholder) */
```

### Border Colors

```css
--border: 214 220 228;              /* #E2E8F0 - Subtle border */
--border-hover: 203 213 225;         /* #CBD5E1 - Hover border */
--border-strong: 148 163 184;        /* #94A3B8 - Strong border */
```

### Semantic Colors

```css
/* Success */
--success: 142 71% 45%;             /* #22C55E - Emerald */
--success-foreground: 0 0% 100%;     /* White */
--success-bg: 142 71% 45% / 0.1;    /* 10% opacity */
--success-border: 142 71% 45% / 0.2; /* 20% opacity */

/* Danger */
--danger: 0 84% 60%;                /* #EF4444 - Red */
--danger-foreground: 0 0% 100%;     /* White */
--danger-bg: 0 84% 60% / 0.1;       /* 10% opacity */
--danger-border: 0 84% 60% / 0.2;    /* 20% opacity */

/* Warning */
--warning: 38 92% 50%;               /* #F59E0B - Amber */
--warning-foreground: 0 0% 100%;     /* White */
--warning-bg: 38 92% 50% / 0.1;     /* 10% opacity */
--warning-border: 38 92% 50% / 0.2;  /* 20% opacity */

/* Info */
--info: 217 91% 60%;                /* #3B82F6 - Blue */
--info-foreground: 0 0% 100%;        /* White */
--info-bg: 217 91% 60% / 0.1;       /* 10% opacity */
--info-border: 217 91% 60% / 0.2;    /* 20% opacity */
```

### Chart Colors

```css
--chart-1: 99 102 241;              /* Indigo */
--chart-2: 34 87% 61%;             /* Green */
--chart-3: 244 83% 68%;             /* Pink */
--chart-4: 24 95% 53%;              /* Orange */
--chart-5: 142 71% 45%;             /* Emerald */
--chart-6: 217 91% 60%;             /* Blue */
--chart-7: 271 91% 65%;             /* Purple */
--chart-8: 30 80% 55%;              /* Teal */
```

### Focus Ring

```css
--ring: 99 102 241;                 /* Primary indigo */
--ring-offset: 210 100% 100%;       /* White/light gray */
```

### Shadows (Layer System)

```css
--shadow-xs: 0 1px 2px 0 rgb(0 0 0 / 0.05);
--shadow-sm: 0 1px 3px 0 rgb(0 0 0 / 0.1), 0 1px 2px -1px rgb(0 0 0 / 0.1);
--shadow: 0 4px 6px -1px rgb(0 0 0 / 0.1), 0 2px 4px -2px rgb(0 0 0 / 0.1);
--shadow-md: 0 10px 15px -3px rgb(0 0 0 / 0.1), 0 4px 6px -4px rgb(0 0 0 / 0.1);
--shadow-lg: 0 20px 25px -5px rgb(0 0 0 / 0.1), 0 8px 10px -6px rgb(0 0 0 / 0.1);
--shadow-xl: 0 25px 50px -12px rgb(0 0 0 / 0.25);
```

### Border Radius

```css
--radius-xs: 0.375rem;              /* 6px - Small elements (badges, tags) */
--radius-sm: 0.5rem;                /* 8px - Inputs, small buttons */
--radius: 0.75rem;                  /* 12px - Cards, buttons (default) */
--radius-lg: 1rem;                  /* 16px - Large cards */
--radius-xl: 1.25rem;               /* 20px - Hero sections, modals */
--radius-2xl: 1.5rem;              /* 24px - Special containers */
--radius-full: 9999px;              /* Full round (avatars, pills) */
```

---

## Typography System

### Font Family

```css
--font-sans: var(--font-geist-sans), -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif;
--font-mono: var(--font-geist-mono), ui-monospace, monospace;
```

### Scale

| Token | Size | Weight | Line Height | Use Case |
|-------|------|--------|-------------|----------|
| `text-xs` | 12px | 500 | 1.5 | Labels, metadata |
| `text-sm` | 14px | 500 | 1.5 | Body text, descriptions |
| `text-base` | 16px | 500 | 1.6 | Primary content |
| `text-lg` | 18px | 500 | 1.6 | Emphasized text |
| `text-xl` | 20px | 600 | 1.4 | Card titles |
| `text-2xl` | 24px | 600 | 1.3 | Section headers |
| `text-3xl` | 30px | 600 | 1.25 | Page titles |
| `text-4xl` | 36px | 600 | 1.2 | Hero headings |
| `text-5xl` | 48px | 700 | 1.1 | Display headings |

### Tracking

```css
tracking-tight: -0.025em;  /* Headings */
tracking-normal: 0;         /* Body text */
tracking-wide: 0.025em;    /* Uppercase text */
```

---

## Spacing System

### Scale (4px base unit)

| Token | Value | Use Case |
|-------|-------|----------|
| `gap-0.5` | 2px | Very tight spacing |
| `gap-1` | 4px | Icon+text, badge padding |
| `gap-2` | 8px | List items, small gaps |
| `gap-3` | 12px | Card internal spacing |
| `gap-4` | 16px | Default spacing |
| `gap-6` | 24px | Section spacing |
| `gap-8` | 32px | Large sections |
| `gap-12` | 48px | Major breaks |

---

## Component Patterns

### Buttons

**Variants:**
- `default` - White background, border, subtle hover
- `primary` - Brand color background, white text
- `secondary` - Muted background
- `ghost` - Transparent, colored on hover
- `danger` - Red background for destructive actions
- `outline` - Transparent with colored border

**Sizes:**
- `xs` - h-8, text-xs, px-3 (32px height)
- `sm` - h-9, text-sm, px-4 (36px height)
- `md` - h-10, text-sm, px-5 (40px height) - **Default**
- `lg` - h-12, text-base, px-6 (48px height)
- `icon` - h-10 w-10 (Square icon button)

**Style Rules:**
- All buttons: `rounded-xl`, `font-medium`, `transition-all duration-200`
- Active state: `active:scale-95`
- Focus: `focus-visible:ring-2`
- Disabled: `opacity-50`, `pointer-events-none`

### Cards

**Structure:**
```tsx
<Card>
  <CardHeader>
    <CardTitle>Title</CardTitle>
    <CardDescription>Optional description</CardDescription>
  </CardHeader>
  <CardContent>
    {/* Main content */}
  </CardContent>
  <CardFooter>
    {/* Actions */}
  </CardFooter>
</Card>
```

**Style Rules:**
- Background: `bg-[rgb(var(--background-card))]`
- Border: `border border-[rgb(var(--border))]`
- Radius: `rounded-2xl` (or `rounded-xl` for compact)
- Shadow: `shadow-sm` (hover: `shadow-md`)
- Padding: `p-6` for standard cards

### Inputs

**Style Rules:**
- Background: `bg-[rgb(var(--background-card))]`
- Border: `border border-[rgb(var(--border))]`
- Radius: `rounded-xl`
- Height: `h-10` (40px)
- Padding: `px-4`
- Focus: `ring-2 ring-[rgb(var(--ring))]`
- Error: `border-[rgb(var(--danger))] ring-[rgb(var(--danger))]`

### Dialogs/Modals

**Style Rules:**
- Overlay: `bg-black/50 backdrop-blur-sm`
- Content: `max-w-lg rounded-2xl bg-card p-6 shadow-xl`
- Animation: `animate-scale-in`

---

## Animation System

### Standard Animations

```css
/* Entry Animations */
@keyframes fade-in {
  from { opacity: 0; }
  to { opacity: 1; }
}

@keyframes slide-in-from-right {
  from { transform: translateX(100%); opacity: 0; }
  to { transform: translateX(0); opacity: 1; }
}

@keyframes slide-up {
  from { transform: translateY(10px); opacity: 0; }
  to { transform: translateY(0); opacity: 1; }
}

@keyframes scale-in {
  from { transform: scale(0.95); opacity: 0; }
  to { transform: scale(1); opacity: 1; }
}

/* Exit Animations */
@keyframes fade-out {
  from { opacity: 1; }
  to { opacity: 0; }
}

@keyframes slide-out-to-right {
  from { transform: translateX(0); opacity: 1; }
  to { transform: translateX(100%); opacity: 0; }
}

@keyframes scale-out {
  from { transform: scale(1); opacity: 1; }
  to { transform: scale(0.95); opacity: 0; }
}
```

### Animation Classes

| Class | Duration | Easing | Use Case |
|-------|----------|--------|----------|
| `animate-fade-in` | 200ms | ease-out | Content appearing |
| `animate-slide-up` | 300ms | ease-out | Page content, lists |
| `animate-scale-in` | 200ms | ease-out | Modals, dropdowns |
| `animate-slide-in` | 300ms | ease-out | Sidebars, drawers |

### Transitions

```css
/* Standard element transitions */
transition-all duration-200 ease-out

/* Color transitions */
transition-colors duration-150

/* Transform transitions */
transition-transform duration-200 ease-out

/* Sidebar/drawer transitions */
transition-transform duration-300 cubic-bezier(0.4, 0, 0.2, 1)
```

---

## Layout Patterns

### Page Structure

```tsx
<div className="space-y-6 animate-fade-in">
  {/* Header */}
  <div className="flex items-center justify-between">
    <div>
      <h1 className="text-3xl font-semibold tracking-tight">Page Title</h1>
      <p className="mt-1 text-sm text-muted-foreground">
        Page description
      </p>
    </div>
    {/* Primary action button */}
  </div>

  {/* Content sections */}
  <div className="grid gap-4 lg:grid-cols-2">
    {/* Cards and content */}
  </div>
</div>
```

### Sidebar Layout

**Desktop (> 1024px):**
- Width: `w-64` (256px) expanded, `w-16` (64px) collapsed
- Logo area: `h-16`
- Navigation: `space-y-1`

**Tablet (641px - 1024px):**
- Auto-collapsed to `w-16`
- Expand on hover (optional)

**Mobile (< 640px):**
- Hidden by default
- Drawer on hamburger menu
- Width: `w-72` (288px) when open

### Grid Systems

```tsx
/* 2 columns, responsive to 1 on mobile */
<div className="grid gap-4 sm:grid-cols-2">
  {/* Cards */}
</div>

/* 3 columns */
<div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
  {/* Cards */}
</div>

/* 4 columns */
<div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
  {/* Cards */}
</div>
```

---

## Responsive Breakpoints

| Breakpoint | Width | Prefix |
|------------|-------|--------|
| Mobile | < 640px | (none) |
| Small | 640px - | `sm:` |
| Medium | 768px - | `md:` |
| Large | 1024px - | `lg:` |
| Extra Large | 1280px - | `xl:` |

---

## Dark Mode

### Dark Color Overrides

```css
.dark {
  --background: 2 6% 23%;           /* #020617 - Deep slate */
  --background-muted: 15 23% 42%;     /* #0F172A - Slate */
  --background-card: 15 23% 42%;      /* #0F172A - Slate */
  --background-sidebar: 15 23% 42%;   /* #0F172A */

  --foreground-primary: 226 32% 94%;  /* #E2E8F0 */
  --foreground-secondary: 215 20% 65%; /* #94A3B8 */
  --foreground-muted: 215 20% 50%;    /* #64748B */
  --foreground-tertiary: 215 20% 30%; /* #475569 */

  --border: 30 41% 59% / 0.5;       /* #334155 at 50% opacity */
  --border-hover: 51 65% 85%;         /* #94A3B8 */

  --success-bg: 142 71% 45% / 0.2;
  --danger-bg: 0 84% 60% / 0.2;
  --warning-bg: 38 92% 50% / 0.2;
  --info-bg: 217 91% 60% / 0.2;

  --ring-offset: 2 6% 23%;
}
```

---

## Accessibility Guidelines

### Color Contrast
- All text must meet WCAG AA: contrast ratio of 4.5:1
- Large text (18px+): 3:1 contrast ratio

### Keyboard Navigation
- All interactive elements must be focusable
- Focus indicators: `focus-visible:ring-2 ring-[rgb(var(--ring))]`
- Logical tab order

### Screen Readers
- Use semantic HTML elements
- Proper ARIA labels for custom components
- Announce dynamic content changes

---

## Component States

### Hover States
- Buttons: `hover:bg-opacity-90` or color shift
- Cards: `hover:shadow-lg`
- Links: `hover:text-[rgb(var(--primary))]`
- Rows: `hover:bg-[rgb(var(--background-muted))]`

### Active States
- Buttons: `active:scale-95` (subtle press feedback)
- Toggles: Instant visual response

### Disabled States
- `opacity-50`
- `pointer-events-none`
- `cursor-not-allowed`

### Focus States
- `outline-none`
- `ring-2 ring-[rgb(var(--ring))]`
- `ring-offset-2 ring-offset-[rgb(var(--ring-offset))]`

---

## Icon Guidelines

### Icon Size Scale

| Size | Use Case |
|------|----------|
| 12px (h-3) | Very small indicators |
| 16px (h-4) | Buttons, badges, inline |
| 20px (h-5) | Cards, navigation, default |
| 24px (h-6) | Large icons, emphasis |
| 32px (h-8) | Hero elements |

### Icon Colors

- `text-[rgb(var(--foreground-muted))]` - Secondary icons
- `text-[rgb(var(--foreground-secondary))]` - Primary icons
- `text-[rgb(var(--primary))` - Brand accent icons
- `text-[rgb(var(--success))]` - Success icons
- `text-[rgb(var(--danger))]` - Warning/danger icons

---

## Loading States

### Skeleton Loaders

```tsx
<SkeletonCard />  /* Card placeholder */
<SkeletonRow cells={3} />  /* Table row placeholder */
```

### Loading Spinners

```tsx
<Loader2 className="h-4 w-4 animate-spin" />
```

---

## Empty States

**Pattern:**
```tsx
<div className="flex flex-col items-center justify-center py-12">
  <div className="flex h-16 w-16 items-center justify-center rounded-full bg-[rgb(var(--background-muted))]">
    <IconName className="h-8 w-8 text-[rgb(var(--foreground-muted))]" />
  </div>
  <div className="mt-4 text-center space-y-1">
    <h3 className="font-semibold text-[rgb(var(--foreground-primary))]">
      Empty State Title
    </h3>
    <p className="text-sm text-[rgb(var(--foreground-muted))]">
      Empty state description
    </p>
  </div>
  {/* Optional action button */}
</div>
```

---

## Toast Notifications

**Positions:**
- `top-4 right-4` - Top right (default)

**Variants:**
- `default` - Information
- `success` - Success confirmation
- `danger` - Error alert
- `warning` - Warning message

**Animation:**
- Entry: `animate-slide-in`
- Exit: `animate-slide-out`

---

## Data Visualization Guidelines

### Charts

**Color Assignment:**
- Use `--chart-1` through `--chart-8` palette
- Consistent colors across charts for same data

### Progress Bars

- Height: `h-2` or `h-3`
- Radius: `rounded-full`
- Background: `bg-[rgb(var(--background-muted))]`
- Fill: Solid color or gradient

### Stat Cards

**Pattern:**
- Icon: 48x48px, colored background
- Value: Large, tabular nums
- Trend: Small indicator with icon
- Variants: `default`, `success`, `danger`, `warning`

---

## Form Guidelines

### Label + Input Pattern

```tsx
<div className="grid gap-2">
  <Label htmlFor="input-id">Label Name</Label>
  <Input id="input-id" placeholder="Placeholder" />
  {error && (
    <p className="text-xs text-[rgb(var(--danger))]">
      {error}
    </p>
  )}
</div>
```

### Form Layout

- Vertical stack with `gap-4`
- Use grid for multi-column forms
- Align primary action to right
- Secondary actions on left or below

---

## Best Practices

### Do's
- ✅ Use whitespace generously
- ✅ Keep text concise and scannable
- ✅ Use icons for visual reinforcement
- ✅ Provide immediate feedback for actions
- ✅ Show loading states for async operations
- ✅ Use semantic HTML elements
- ✅ Test on all breakpoints

### Don'ts
- ❌ Overcrowd the interface
- ❌ Use more than 3-4 colors per screen
- ❌ Hide important actions behind clicks
- ❌ Use jarring or abrupt animations
- ❌ Mix inconsistent component styles
- ❌ Ignore accessibility

---

## File Structure

```
components/
├── ui/              # Reusable primitive components
├── layout/          # Layout components (sidebar, header)
├── dashboard/       # Dashboard-specific components
├── transactions/    # Transactions components
├── analytics/       # Analytics components
├── categories/      # Categories components
├── budget/         # Budget components
└── settings/       # Settings components
```

---

## Implementation Notes

- All color values use HSL format for easier theming
- Border radius is consistent across components
- Animations use CSS native support (no JS libraries)
- Transitions are hardware-accelerated (transform, opacity)
- Dark mode is supported at all levels
- Mobile-first responsive design
