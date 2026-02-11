# MARKETLENS v2.0 - ARCHITECTURAL STANDARDS (STRICT MODE)

## 1. THE "NO-INLINE" PROTOCOL
* **Strict Ban:** Do NOT use `style={{ ... }}` for static styling (colors, padding, margins, fonts).
* **Exception:** Inline styles are permitted ONLY for dynamic, calculated values (e.g., `width: ${progress}%`, `transform: translate(x, y)`).
* **Enforcement:** If you are typing a hex code (`#`) or `px` value in a `.jsx` file, you are wrong. Stop. Put it in the CSS.

## 2. THE SINGLE SOURCE OF TRUTH (CSS VARIABLES)
* **Variables Only:** We never use raw hex codes in components.
    * ❌ BAD: `color: '#22d3ee'`
    * ✅ GOOD: `color: 'var(--neon-cyan)'` (or better, use a class).
* **Opacity:** Do not use `rgba` manually. If we need transparent colors, define them as variables (e.g., `--bg-row-odd`) in `global.css`.

## 3. COMPONENT COMPOSITION
* **Props over Style:** Do not pass style objects to components. Pass **Intent**.
    * ❌ BAD: `<StatCard style={{ borderColor: 'red' }} />`
    * ✅ GOOD: `<StatCard variant="alert" />`
* **Logic Separation:** Styles should not live in JavaScript logic variables (e.g., `const color = isError ? 'red' : 'blue'`). Instead, calculate a `className` (e.g., `status-error` or `status-active`) and let CSS handle the color.

## 4. CSS CLASS NAMING CONVENTION (BEM-ISH)
* **Blocks:** `.panel-industrial`, `.inventory-table`
* **Elements:** `.panel-header` (not `.header`), `.inventory-row`
* **Modifiers:** `.panel-industrial.collapsed`, `.inventory-row.selected`
* **Utility:** Use the specific utility classes defined in `global.css` (e.g., `.text-muted`, `.flex-between`, `.text-alert`).

## 5. FILE STRUCTURE
* **`src/styles/global.css`**: Contains ALL variables, typography, and shared component classes.
* **`src/features/[feature]/[Feature].css`**: strictly for Grid Layouts and positioning specific to that feature.