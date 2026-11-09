# tt_landing_v2

TeamTrace marketing landing page — Next.js 16 (App Router), TypeScript, Tailwind CSS v4, Motion (Framer Motion), Phosphor icons, Lenis.

```bash
cp .env.example .env.local   # set NEXT_PUBLIC_SITE_URL (required for production builds)
npm run dev                  # http://localhost:3000
npm run build
npm run check                # lint + typecheck + format check
```

The original HTML/CSS/JS demo this was ported from lives in `teamtrace-website-basic/` for reference.

## Where things are controlled

| What                                                                    | File                                           |
| ----------------------------------------------------------------------- | ---------------------------------------------- |
| Colors, gradients, shadows, type scale, radius, spacing, breakpoints    | `src/styles/theme.css`                         |
| Utilities Tailwind can't express (orb ring, gradient text, glows)       | `src/styles/globals.css`                       |
| Fonts                                                                   | `src/theme/fonts.ts`                           |
| Animation durations, easings, variants, behaviour timings               | `src/theme/motion.ts`                          |
| Color names usable in page data (`color: "coral"`), value tones         | `src/theme/colors.ts`                          |
| Breakpoints and nav offset for JavaScript (keep in sync with theme.css) | `src/theme/breakpoints.ts`                     |
| Icon defaults and the shared icon gradient                              | `src/theme/icons.tsx`, `icon-gradient.tsx`     |
| Class merging (lists the custom scale names, keep in sync)              | `src/lib/cn.ts`                                |
| Home page content (all of it, inline at each component call)            | `src/app/page.tsx`                             |
| Navigation and footer links                                             | `src/components/site/navbar.tsx`, `footer.tsx` |
| Site name, URL, SEO defaults                                            | `src/config/site.ts`, `.env.local`             |
| Social image (colors mirror theme.css)                                  | `src/app/opengraph-image.tsx`                  |

**Rules**

- Components use only theme token classes (`bg-surface`, `text-muted`, `rounded-card`, `text-h2`…), never raw hex colours. One-off geometry (chart maths, the scaled circuit board) is the only place arbitrary values appear.
- Glows and tints are derived from the brand colours with `color-mix()`, so changing `--sky` restyles every sky glow too.
- Components contain no user-facing text: labels, including screen-reader text, come in as props.
- Components are generic: content always comes in as props/data from `page.tsx`, written at the call site.
- Icons: server components import from `@phosphor-icons/react/ssr`, client components from `@phosphor-icons/react`.

**Adding light mode later:** add a `[data-theme="light"]` block in `theme.css`, switch `data-theme` on `<html>` (e.g. with `next-themes`), add a toggle. No component changes needed.

## Components

Every folder has an `index.ts`, so pages import from the folder: `import { Card, Chip } from "@/components/ui"`.

| Folder         | Files                                                                                                                                                                    |
| -------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| `layout/`      | `section` — Container, Section, SectionHeader                                                                                                                            |
| `ui/`          | `button`, `avatar`, `typography`, `surfaces` (Card, Surface, Callout, IconTile), `indicators` (Chip, StatusPill, Dot, Toggle), `controls` (SegmentedControl, RangeField) |
| `content/`     | `cards` (StatCard, AccentCard, Testimonial, SignalColumn), `blocks` (FeatureItem, NumberedPoint, FeatureSplit), `logos` (ComplianceSeal, LogoTile)                       |
| `app-mock/`    | Product-screen mock-ups: `frames`, `widgets`, `tables`, `kanban`, `now-playing`                                                                                          |
| `dataviz/`     | `charts` (bar, grouped bar, line, gauge, donut, heatmap), `rows` (timelines, meters, metric lists), `legend`                                                             |
| `interactive/` | One file per interactive piece: scroll stepper, list tabs, switch view, spectrum plot, circuit diagram, learning orb, accordion, reveal, swap                            |
| `assistant/`   | The TraceAI orb, its readout/console and their shared context                                                                                                            |
| `effects/`     | `shader-canvas` (WebGL), `shaders`, `horizon-glow`                                                                                                                       |
| `nav/`         | Navigation building blocks: `nav-bar`, `menus`, `mobile-menu`, `scroll-progress`, `footer-column`, `footer-parts`, `types`                                               |
| `site/`        | The site's `navbar` and `footer` (rendered in `app/layout.tsx`)                                                                                                          |

Shared helpers: `src/hooks/` (`use-media-query`, `use-timeouts`, `use-pointer-gaze`) and `src/lib/` (`cn`, `roving-index` for keyboard tab lists, `a11y` for chart labels).
