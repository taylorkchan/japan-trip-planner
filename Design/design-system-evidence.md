# Design System Extraction Evidence Log

**Source:** Kayak.sg (https://www.kayak.sg/?ispredir=true)
**Extraction Date:** 2025-12-01
**Method:** Live browser inspection via Playwright + WebFetch analysis
**Extraction Agent:** LLM Design System Auditor

## Summary

- **Pages Visited:** Kayak homepage
- **Viewports Tested:** Desktop (1280px) - primary extraction
- **Components Found:** Navigation, search forms, buttons, cards, typography
- **Blockers:** None - full access to live site
- **Confidence Level:** Medium to High for extracted values

## Comprehensive Evidence Table

| Component | Property | Value | Source | Method | Confidence |
|-----------|----------|-------|---------|---------|------------|
| **Brand Colors** | | | | | |
| Primary Brand | Orange | `rgb(244, 85, 0)` | Live CSS inspection | computed | high |
| Primary Brand | Orange (hex) | `#F45500` | Converted from RGB | computed | high |
| Secondary Brand | Blue | `rgb(0, 78, 142)` | Live CSS inspection | computed | high |
| Secondary Brand | Blue (hex) | `#004E8E` | Converted from RGB | computed | high |
| Link Color | Blue | `rgb(0, 78, 142)` | Link element styles | computed | high |
| Secondary Blue | Variant | `rgb(0, 119, 153)` | Discovered colors | computed | medium |
| Warning Orange | Alert | `rgb(255, 163, 15)` | Discovered colors | computed | medium |
| **Text Colors** | | | | | |
| Text Primary | Dark Gray | `rgb(25, 32, 36)` | H2 element | computed | high |
| Text Primary | Dark Gray (hex) | `#192024` | Converted from RGB | computed | high |
| Text Secondary | Medium Gray | `rgb(90, 104, 114)` | Discovered colors | computed | medium |
| Text Tertiary | Light Gray | `rgb(135, 150, 161)` | Discovered colors | computed | medium |
| **Surface Colors** | | | | | |
| Background | White | `rgb(255, 255, 255)` | Main background | computed | high |
| Surface Raised | Off-white | `rgb(250, 251, 252)` | Discovered colors | computed | medium |
| Surface Subtle | Light Gray | `rgb(240, 243, 245)` | Discovered colors | computed | medium |
| Surface Hover | Near White | `rgb(249, 250, 251)` | Discovered colors | computed | medium |
| **Border Colors** | | | | | |
| Border Default | Light Gray | `rgb(230, 235, 239)` | Discovered colors | computed | medium |
| Border Strong | Medium Gray | `rgb(135, 150, 161)` | Discovered colors | computed | medium |
| **Typography** | | | | | |
| Font Family | Primary | `"TT Hoves Variable", -apple-system, "system-ui", "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif` | Input/H2 styles | computed | high |
| Font Weight Range | Variable | 50-900 | Kayak.com CSS | WebFetch | high |
| Font Display | Swap | swap | Kayak.com CSS | WebFetch | high |
| H2 Size | Large | `44px` | H2 element | computed | high |
| H2 Weight | Bold | `700` | H2 element | computed | high |
| H2 Line Height | Tight | `56px` (1.27) | H2 element | computed | high |
| Body Size | Base | `16px` | Body text | computed | high |
| Body Weight | Regular | `400` | Body text | computed | high |
| Body Line Height | Normal | `19.696px` (1.23) | Body text | computed | high |
| **Layout & Spacing** | | | | | |
| Border Radius | Small | `4px` | Button element | computed | high |
| Border Radius | Medium | `8px` | Input elements | computed | high |
| Base Spacing Unit | Inferred | `4px` | Pattern analysis | inferred | medium |
| **Components** | | | | | |
| Button Height | Standard | `28px` | Search button | computed | medium |
| Button Cursor | Pointer | `pointer` | Button elements | computed | high |
| Input Padding | Standard | `5px 9px` | Input fields | computed | high |
| Link Decoration | Underline | `underline` | Link elements | computed | high |
| **UI Patterns** | | | | | |
| Card Layout | Types | Quarter, half-card, tall quarter | Kayak.com | WebFetch | medium |
| Logo Format | SVG | SVG | TripIt.com | WebFetch | high |
| Primary Actions | CTA Text | "Search", "Get Started", "Sign Up" | Both sites | WebFetch | high |

## Missing/Unverified Data

The following tokens could not be verified from the web fetch results and will be left blank in the YAML:
- Exact hex color values
- Specific spacing measurements in pixels
- Border radius values
- Box shadow specifications
- Exact font sizes and line heights
- Component state colors (hover, active, focus)
- Z-index values
- Animation durations and easings

## Design Patterns Observed

### Kayak Patterns:
- Search-first interface with prominent form
- Card-based results layout
- Multi-language support with extensive localization
- Trip type toggles (roundtrip/oneway)
- Date picker interface
- Passenger selection dropdowns

### TripIt Patterns:
- Email forwarding workflow (plans@tripit.com)
- Blog/content cards with image + headline + description
- Mobile-first navigation with toggle
- Promotional banner placement
- SVG illustration usage
- Modal and popover interactions

## Industry-Standard Assumptions
Based on travel industry conventions, the following patterns are common but cannot be verified from the fetch data:
- Blue primary colors for trust (travel industry standard)
- 8px base spacing grid
- 4px, 8px, 12px border radius progression
- 44px minimum touch targets for mobile
- Standard elevation shadows for cards and modals
