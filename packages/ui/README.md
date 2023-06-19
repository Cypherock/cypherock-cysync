# CySync UI

- UI library for cysync
- All the resuable components should be defined here
- These components are styled using `styled-components`
- Do not use hardcoded text inside components, they should be injected by
  by the user of this library via props. This is to ensure all texts are
  defined in `i18n`.
- All the texts should be displayed via `<LangDisplay>` component.
- Define and export types for props.
