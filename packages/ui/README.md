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

- Put the SVG in `./icons`.
- Run `pnpm build:icons` to generate the components at `src/assets/icons/generated`.
- Import the components from the aforementioned path.

### Notes

- `fill` and `stroke` can be passed to such components and those will
  replace the fill and stroke props of the child elements such as `path`,
  `circle`, `line`, and `rect`.
- All the other SVG attributes such as `width` and `height` will be passed
  to the root `<svg>` tag instead.
- Check `/src/assets/icons/Svg.tsx` for all possible props
