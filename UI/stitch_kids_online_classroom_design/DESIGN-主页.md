# Design System Strategy: The Academic Sanctuary

## 1. Overview & Creative North Star
The "Academic Sanctuary" is a design system crafted to balance the rigor of education with the vibrant energy of youth. Our North Star is **"Guided Clarity"**—a philosophy that moves beyond the typical "box-heavy" educational dashboard to create a spacious, breathing environment where students feel focused, not overwhelmed.

We break the "template" look by employing intentional asymmetry in our layout grids and utilizing tonal depth instead of harsh lines. While inspired by institutional reliability, the system uses "Glassmorphism" and a "Soft-Focus" aesthetic to make the digital classroom feel like a premium, tactile physical environment.

---

## 2. Colors: Tonal Architecture
Our palette transitions from a foundation of architectural neutrals to a signature "Success Green" (`primary`).

### The Palette
- **Primary Foundation:** `#006a36` (Primary) for high-impact CTAs like 'Join Class'.
- **Secondary Accents:** `#0058b9` (Secondary) for informational depth and navigation.
- **The Neutrals:** We utilize a range of whites and greys (from `surface-container-lowest` `#ffffff` to `surface-dim` `#d1d5d7`) to build our world.

### The "No-Line" Rule
Traditional 1px solid borders are strictly prohibited for sectioning. To separate the sidebar from the main stage, or the course grid from the schedule, use a background shift. 
*   **Example:** Place a `surface-container-low` (`#eff1f2`) sidebar against a `background` (`#f5f6f7`) main body. The edge is defined by the value change, not a stroke.

### Surface Hierarchy & Nesting
Think of the UI as a series of nested paper layers.
1.  **Stage (Base):** `background` (`#f5f6f7`)
2.  **Section (Mid):** `surface-container` (`#e6e8ea`)
3.  **Active Card (High):** `surface-container-lowest` (`#ffffff`)

### The "Glass & Gradient" Rule
For elements that need to feel "alive," such as the active course banner or floating status indicators, apply a `surface-container-lowest` background at 80% opacity with a `20px` backdrop-blur. For main primary CTAs, use a subtle linear gradient from `primary` (#006a36) to `primary_dim` (#005c2e) to give the button a "pressed silk" texture.

---

## 3. Typography: Editorial Authority
We utilize a dual-typeface system to bridge the gap between friendly and professional.

- **Headlines & Display:** **Plus Jakarta Sans** is our voice. It is clean and modern with a geometric soul. We use massive scales for titles (e.g., `display-lg` at 3.5rem) to create an editorial, high-end feel that contrasts with functional content.
- **Functional UI & Labels:** **Manrope** is used for `label-md` and `label-sm`. Its condensed nature makes it perfect for status indicators (e.g., "Time Remaining") and sidebar navigation, ensuring high legibility at small sizes.

The hierarchy is intentional: Bold, large headlines establish the "Sanctuary" vibe, while smaller, high-contrast labels maintain "Classroom" efficiency.

---

## 4. Elevation & Depth: The Layering Principle
We reject traditional drop shadows in favor of **Tonal Layering**.

- **Ambient Shadows:** When a card must float (e.g., a "Join Class" modal), use an extremely diffused shadow: `box-shadow: 0 20px 40px rgba(44, 47, 48, 0.06)`. The shadow color is derived from `on-surface` at a tiny opacity, mimicking natural sunlight.
- **The "Ghost Border" Fallback:** If accessibility requires a border, use the `outline-variant` (`#abadae`) at **15% opacity**. It should be felt, not seen.
- **Depth via Softness:** Use the `xl` (1.5rem) roundedness for course cards to soften the visual weight of the grid, making the platform feel approachable for younger learners.

---

## 5. Components: Intentional Primitives

### Buttons: The "Call to Action"
- **Primary (Join Class):** Pill-shaped (`rounded-full`), using the `primary` to `primary_dim` gradient. White text (`on_primary`).
- **Secondary:** Transparent background with a `Ghost Border` and `secondary` text.
- **Tertiary:** Pure text with a 12% `surface-variant` hover state.

### Cards: The Course Container
- **Style:** `surface-container-lowest` background, `lg` corner radius, no border.
- **Header:** A 16:9 image container with a subtle inner glow. 
- **Content:** Use `title-md` for course names and `body-sm` for teacher details. Never use a divider line; use `1.5rem` of vertical padding to separate text from image.

### Sidebar Navigation
- **Active State:** A "pill" background using `secondary_container` (`#bed2ff`) with a high-contrast icon.
- **Inactive State:** `on_surface_variant` text with no background.
- **Spacing:** Generous vertical rhythm (24px between items) to ensure the interface feels premium and uncluttered.

### Status Indicators (Badges)
- **Time Remaining:** Use `tertiary_container` (`#f99a3f`) for urgency without the alarmism of red. 
- **Class Status:** High-saturation `primary` for "Live" states, providing a "Vibrant Green" signal as requested.

---

## 6. Do's and Don'ts

### Do:
- **Do** use whitespace as a structural element. If a layout feels cramped, double the margins before adding a border.
- **Do** use the `primary_fixed` color for subtle highlights, like a 4px left-border on an active notification.
- **Do** utilize "Glassmorphism" for the top search/header bar to let the course cards scroll softly beneath it.

### Don't:
- **Don't** use black (`#000000`). Our darkest color is `inverse_surface` (`#0c0f10`) to maintain a soft, premium feel.
- **Don't** use 1px dividers to separate list items in the sidebar or schedule. Use a `surface-container-high` hover state to define rows.
- **Don't** use sharp corners. Everything in the sanctuary is rounded (minimum `sm` 0.25rem) to ensure the environment feels safe and kid-friendly.