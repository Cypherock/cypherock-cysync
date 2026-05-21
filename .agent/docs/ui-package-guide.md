# UI Package Guide

Guide for adding and modifying components in the `@cypherock/cysync-ui` package. The library uses Atomic Design with styled-components and a centralized theme system.

## Package Location

- **UI Library:** `packages/ui/`
- **Desktop wrapper:** `packages/desktop-ui/` — wraps UI with ThemeProvider and app-level providers
- **Storybook:** `packages/ui/.storybook/` (v7.2, react-vite framework)

## Architecture

**Atomic Design** with two levels:
- **Atoms** (`packages/ui/src/components/atoms/`) — 36 base building blocks (Button, Typography, Flex, Container, Input, Modal, Checkbox, Toggle, etc.)
- **Molecules** (`packages/ui/src/components/molecules/`) — 57 composite components organized in subdirectories (Dialog, Dropdown, Input variants, Table, Graph, SideBar, Notification, etc.)

**Styling:** styled-components 6 with CSS-in-JS. No CSS modules or Tailwind.

**Theming:** Centralized theme object consumed via `ThemeProvider` from styled-components.

## Adding a New Atom

1. Create `packages/ui/src/components/atoms/MyComponent.tsx`
2. Define props interface extending `UtilsProps` for layout flexibility
3. Create styled component, apply `${utils}` interpolation for utility props
4. Export the component with `defaultProps` for optional fields
5. Add export to `packages/ui/src/components/atoms/index.ts`

**Reference:** `packages/ui/src/components/atoms/Button.tsx` for a complete atom with variants and sizes.

### Props pattern

Every atom should accept `UtilsProps` (defined in `packages/ui/src/components/utils/index.ts:17-31`) which provides:
- **Spacing:** `m`, `p`, `mt`, `mb`, `ml`, `mr`, `mx`, `my`, `pt`, `pb`, `px`, `py` (numeric, maps to theme spacing)
- **Flex:** `gap`, `justify`, `align`, `direction`, `grow`, `shrink`, `alignSelf`
- **Font:** `fontSize`, `fontWeight`
- **Dimensions:** `width`, `height`, `$maxWidth`, `$minWidth`
- **Position:** `position`, `top`, `left`, `right`, `bottom`, `zIndex`
- **Border, background, display, shadow, transform**

Responsive values supported: `mb={{ def: 1, md: 2, lg: 3 }}` maps to media queries defined in the theme.

### Variant pattern

For components with visual variants, use a CSS RuleSet map:

```
const variantStyleMap: Record<Variant, RuleSet<Props>> = {
  primary: css<Props>`...`,
  secondary: css<Props>`...`,
};
```

Reference: `packages/ui/src/components/atoms/Button.tsx` — `buttonSizeStyle` and `buttonStyle` maps.

## Adding a New Molecule

1. Create directory `packages/ui/src/components/molecules/MyComponent/`
2. Create component files (split sub-components into separate files if complex)
3. Create `index.ts` re-exporting all public components
4. Add export to `packages/ui/src/components/molecules/index.ts`

**Reference patterns by complexity:**

- **Simple molecule:** `packages/ui/src/components/molecules/Prefabs/BackButton.tsx` — combines Button + Flex + Image + Typography
- **Compound molecule:** `packages/ui/src/components/molecules/Dialog/DialogBox.tsx` — exports `DialogBox`, `DialogBoxHeader`, `DialogBoxBody`, `DialogBoxFooter` as composable pieces
- **Input molecule:** `packages/ui/src/components/molecules/Input/` — Input, PasswordInput, TextAreaInput, InputContainer, InputLabel

### Compound component pattern

For complex UI that users need to compose flexibly:

```
export const MyComponent = ({ children }) => <Wrapper>{children}</Wrapper>;
export const MyComponentHeader = ({ children }) => <Header>{children}</Header>;
export const MyComponentBody = ({ children }) => <Body>{children}</Body>;
export const MyComponentFooter = ({ children }) => <Footer>{children}</Footer>;
```

Reference: `packages/ui/src/components/molecules/Dialog/DialogBox.tsx:42-184`

## Theme System

**Theme definition:** `packages/ui/src/themes/theme.styled.ts`

Key theme sections:
- `palette.text` — heading, muted, error, white, gold, silver, disabled
- `palette.background` — primary, secondary, input, container, disabled, ~40 more
- `palette.border` — popup, input, separator, error, warning
- `palette.gradients` — primary, secondary, golden, silver, cardDefault, cardSelected
- `typography` — h1-h6 font sizes
- `spacing` — numeric scale (one through twelve)
- `screens` / `screenSizes` — responsive breakpoints (def, md, mdlg, lg, xl)

**Color theming:** `packages/ui/src/themes/color.styled.ts` — two vendor themes (`default` gold, `odix` warm tones) controlled by `window.cysyncEnv.VENDOR`

**Accessing theme in components:** Use `props.theme.palette.*` in styled-components or `useTheme()` hook.

## Icon System

**Source SVGs:** `packages/ui/icons/` (161 raw SVG files)
**Generated components:** `packages/ui/src/assets/icons/generated/` (157 React components)

### Adding a new icon

1. Add SVG file to `packages/ui/icons/MyIcon.svg`
2. Run `pnpm build:icons` (from `packages/ui/`)
3. SVGR generates `packages/ui/src/assets/icons/generated/MyIcon.tsx` automatically
4. Icon is auto-exported via `packages/ui/src/assets/icons/index.ts`
5. Import as `import { MyIcon } from '@cypherock/cysync-ui'`

**SVGR config:** `packages/ui/.svgrrc.js` — custom template wrapping SVG in `SvgStyle` component
**Icon base component:** `packages/ui/src/assets/icons/Svg.tsx` — `SvgStyle` extends SVGProps + UtilsProps (supports sizing, spacing, positioning)

Generated icons accept `fill` and `stroke` props for color customization.

## Storybook

**Start:** `pnpm storybook` (port 6006)
**Build:** `pnpm build:storybook`

### Adding a story

Create `packages/ui/src/stories/{atoms|molecules}/MyComponent.stories.tsx`:

```
import type { Meta, StoryObj } from '@storybook/react';
import { MyComponent } from '../../components/atoms/MyComponent';

const meta: Meta<typeof MyComponent> = {
  component: MyComponent,
  tags: ['autodocs'],
};
export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: { variant: 'primary', children: 'Hello' },
};
```

Reference: `packages/ui/src/stories/atoms/Button.stories.tsx`

## Build & Output

- **ESM:** `dist/esm/index.js` (primary)
- **CJS:** `dist/cjs/index.js`
- **Build:** `pnpm build` runs tsc + copyfiles for assets (PNG, JPG, SVG, WEBM)
- **Icons:** `pnpm build:icons` runs SVGR CLI on `icons/` directory

## Export Structure

`packages/ui/src/index.ts` exports:
- `components` — all atoms and molecules + `GlobalStyles`
- `themes` — `ThemeProvider`, `useTheme()`, `theme` object, `getDefaultTheme()`
- `assets` — icons (157 components), images, videos
- `types` — TypeScript declarations
- `hooks` — `useTheme`, `useAccordion`, `useOverflow`, `addKeyboardEvents`

## How Apps Consume

Apps don't import `@cypherock/cysync-ui` directly. The chain is:

```
desktop app -> @cypherock/cysync-desktop-ui -> @cypherock/cysync-core (pages) -> @cypherock/cysync-ui (components)
```

`packages/desktop-ui/src/app.tsx:19-86` wraps the app with `ThemeProvider` and `GlobalStyles`.

## Checklist for New Components

- [ ] Component file created in correct directory (atoms/ or molecules/)
- [ ] Props interface extends `UtilsProps` for layout flexibility
- [ ] Styled component uses `${utils}` interpolation
- [ ] Theme values used for colors/spacing (no hardcoded values)
- [ ] Export added to the appropriate `index.ts` barrel file
- [ ] Storybook story created with `tags: ['autodocs']`
- [ ] `pnpm build` succeeds in `packages/ui/`
- [ ] Component renders correctly in Storybook
