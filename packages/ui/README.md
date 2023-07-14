# CySync UI

- UI library for cysync
- All the resuable components should be defined here
- These components are styled using `styled-components`
- Do not use hardcoded text inside components, they should be injected by
  by the user of this library via props. This is to ensure all texts are
  defined in `i18n`.
- All the texts should be displayed via `<LangDisplay>` component.
- Define and export types for props.

## Icons

- React components for the icons can be generated from the SVGs in `./icons`
  using `pnpm build:icons` -`fill` and `stroke` can be passed to such components and those will replace
  the fill and stroke props of the child elements such as `path` ,`circle`,
  `line`, and `rect`.
- All the other SVG attributes such as `width` and `height` will be passed to
  the root `<svg>` tag instead
