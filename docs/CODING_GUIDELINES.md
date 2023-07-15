# Coding Guidelines

## Table of contents

1. [Understanding the directory structure](#understanding-the-directory-structure)
2. [General Guidelines](#general-guidelines)
3. [References](#references)

## Understanding the directory structure

### Structure

```
├── apps                # Contains all the applications
│   └── desktop             # CySync desktop application, contains all electron code
│   └── cli                 # CySync cli application
│
├── packages            # All packages required for apps
│   └── ui                  # UI library for cysync containing all components
│   └── interfaces          # Contains all `types` which needs to be shared between packages
│   └── desktop-ui          # Renderer part of desktop application
│   └── coins               # Static coin information
│   └── coin-support-*      # Coin support functionalities
│   └── cysync-core         # Contains all business logic of cysync, like pages, context etc
│   └── db-interfaces       # Interface for `database`
│   └── database            # Database implementation for electron
│   └── util-*              # Common utilities shared between packages
│
├── submodules          # Packages used by cysync but exist on different repository
│   └── sdk                 # SDK for communicating with Cypherock hardware
│
├── scripts             # Contains scripts to be used by the build system

├── package.json

```

### Purpose of different packages
- [`packages/ui`](../packages/ui/README.md)
- [`packages/coins`](../packages/coins/README.md)
- [`packages/interfaces`](../packages/interfaces/README.md)
- [`packages/utils`](../packages/utils/README.md)
- [`packages/db-interfaces`](../packages/db-interfaces/README.md)
- [`packages/database`](../packages/database/README.md)
- [`packages/cysync-core`](../packages/cysync-core/README.md)
- [`packages/desktop-ui`](../packages/desktop-ui/README.md)
- [`apps/desktop`](../apps/desktop/README.md)

## General Guidelines

> NOTE: There might be cases where these guidelines do not apply.
> It is upto the developer and the maintainer to make sure these guidelines are
> followed whereever possible, and ignore the ones that don't apply at a
> particualar case.

### Reusability

- Follow `DRY`, `KISS`, and `YAGNI`

### Naming convention

- Use `PascalCase` for type names.
- Use `PascalCase` for enum values.
- Use `camelCase` for function names.
- Use `camelCase` for property names and local variables.
- Use `camelCase` for file names. Except for react components, which should be
  in `PascalCase`.
- Do not use \_ as a prefix for private properties.
- Use whole words in names when possible.
- `boolean` variables should start with `is`, `has`, `do` or similar, to indicate
  it's a boolean value.
- function name should indicate an action.
  - example:
    - ❌: `isPasswordCorrect`
    - ✅: `checkPassword`, `createUser`, `showSnakbar`, `validateInput`, `getConfig`

### `null` and `undefined`

- Use `undefined`. Do not use `null`.

### Recommended file length

- Try to keep your files under `250` lines of code.

### Nesting levels

Try to avoid nesting code too many levels deep.
For example, in the loop, it’s sometimes a good idea to use the continue directive to avoid extra nesting.

For example, instead of adding a nested if conditional like this:

```ts
// ❌
for (let i = 0; i < 10; i++) {
  if (cond) {
    ... // <- one more nesting level
  }
}
```

We can write:

```ts
// ✅
for (let i = 0; i < 10; i++) {
  if (!cond) continue;
  ...  // <- no extra nesting level
}
```

A similar thing can be done with if/else and return.

### Function breakdown

Try to create sections in your functions by using line breaks.

```ts
// ❌
const runAlgorithm = () => {
  const config = getConfig();
  const userInputs = getUserInputs();
  const { error, inputs } = validateInputs(userInputs);
  if (error) {
    throw new ValidationError();
  }
  let result = [];
  for (const key in inputs) {
    // ... algorithm code
  }
  return result;
};
```

```ts
// ✅
const runAlgorithm = () => {
  // Section to declare variables
  const config = getConfig();
  const userInputs = getUserInputs();

  // Section to validate inputs
  const { error, inputs } = validateInputs(userInputs);
  if (error) {
    throw new ValidationError();
  }

  // Section to execute the algorithm
  let result = [];
  for (const key in inputs) {
    // ... algorithm code
  }

  // Section to return result
  return result;
};
```

NOTE: The comments above are just to explain the different sections and should
not exist in the actual code.

### Comments

- Do not ❌
  - comment out code that is not used.
  - comment what the code already states
    - Example
    ```ts
    i = i + 1;     // Add one to i
    ```
  - explain unclear code in comments, rather refactor the code to make it clear.
- Do ✅
  - use comments explain why this code is necessary.
  - explain unidiomatic code in comments.
  - provide links to the original source of copied code.
  - include links to external references where they will be most helpful.
  - add comments when fixing bugs which explains the edge case that caused the bug.
  - use comments to mark incomplete implementations.

### Conditional values

- Prefer using `nullish coalescing operator` over of `ternary` or `&& / ||` operators.

  ```ts
  // ❌
  const displayName = user.firstName ? user.firstName : user.lastName;
  ```

  ```ts
  // ❌
  const displayName = user.firstName || user.lastName;
  ```

  ```ts
  // ✅
  const displayName = user.firstName ?? user.lastName;
  ```

- Do not use `ternary` operator for more than one condition

  ```ts
  // ✅
  const connectionState = device.connected ? 'connected' : 'disconnected';
  ```

  ```ts
  // ❌
  const connectionState = device.connected ? 'connected' : device.isBootloader ? 'bootloader' : 'disconnected';
  ```

  ```ts
  // ✅
  let connectionState = 'disconnected';
  if (device.connected) {
      connectionState = 'connected';
  } else if(device.isBootloader) {
      connectionState = 'bootloader';
  }
  ```

- Use object for mapping variables into different format.

  ```ts
  // ❌
  let fontWeightNumber: number;
  if(fontWeight === 'light') {
      fontWeightNumber = 300;
  } else if (fontWeight === 'normal') {
      fontWeightNumber = 400;
  } else if (fontWeight === 'bold') {
      fontWeightNumber = 700;
  } else {
      fontWeightNumber = 400;
  }
  ```

  ```ts
  // ✅
  const fontWeightMap = {
      light: 300,
      normal: 400,
      bold: 700
  };

  const fontWeightNumber = fontWeightMap[fontWeight] ?? fontWeightMap.normal;
  ```

### React

#### Styling

- Use `styled-components` while creating UI components.
- Use props on UI components to modify the styling, over directly changing the css.

  ```tsx
  // ❌
  <Button variant="primary" style={{ border: 'none' }}>Continue</Button>
  ```

  ```tsx
  // ✅
  <Button variant="primary" noBorder={true}>Continue</Button>
  ```

#### Logic

- Create reusable hooks where possible.
- Global states should be defined in Redux store.
- Separate business logic from UI.

  ```tsx
  // ❌
  const SetPassword = () => {
      const handleSetPassword = (password: string) => {
          const db = getDB();
          const passwordHash = createHash(password);

          db.setPassword(passwordHash);
          db.encryptWithPassword(passwordHash);
      }

      return (
        <div>
            {/* ... */}
        </div>
      );
  }
  ```

  ```tsx
  // ✅
  import { setDatabasePassword } from '~/database';

  const SetPassword = () => {
      const handleSetPassword = (password: string) => {
          setDatabasePassword(password);
      }

      return (
        <div>
            {/* ... */}
        </div>
      );
  }
  ```

## References

- [https://stackoverflow.blog/2021/12/23/best-practices-for-writing-code-comments/](https://stackoverflow.blog/2021/12/23/best-practices-for-writing-code-comments/)
- [https://javascript.info/coding-style](https://javascript.info/coding-style)
