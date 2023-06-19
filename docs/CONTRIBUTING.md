# Contributing

## Guidelines

### Important Steps
Before submitting a pull request, please make sure the following is done:

- Fork the repository and create your branch from develop.
- Follow the local setup steps [here](../README.md#development-setup).
- Make your changes following the [CODING GUIDELINES](./CODING_GUIDELINES.md).
- If you've fixed a bug or added code that should be tested, add tests!
- Add an entry to the changelog (`pnpm changeset`).
- Make sure that the code passes linter (`pnpm lint` and `pnpm pretty`).
- Make sure the code passes unit and end to end tests (`pnpm test` and `pnpm e2e`).

### Git conventions

#### Branch naming
Depending on the purpose every git branch should be prefixed.

- `feat/`: when adding a new feature
- `fix/`: when fixing an existing bug
- `refactor/`: when refactoring

#### Commit messages
We use the standard [**Conventional Commits**](https://www.conventionalcommits.org/) specification and enforce it using [**commitlint**](https://commitlint.js.org/).
