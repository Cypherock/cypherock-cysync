# Cypherock cySync

## Table of contents

1. [Prerequisites](#prerequisites)
2. [Understanding the directory structure](#understanding-the-directory-structure)
3. [Development Setup](#development-setup)
4. [Local setup](#local-setup)
5. [Other commands](#other-commands)
6. [Contributing](#contributing)

## Prerequisites

Before you get started, please make sure you have the following setup -

- Node.js v18 (use [nvm][1] if already using a different Node version).
- [`pnpm`][2]
  ```
  npm i -g pnpm
  ```
- Python >=3.6 (But less than 3.10)
  - [Download][7] and install the latest Python version.
  - Run `npm config set python /path/to/executable/python` to configure.
- Install and set up [node-gyp][6] -
  - `npm i -g node-gyp` to install.
  - For Windows, follow an additional step -
    - Install Visual C++ 2017 Build Environment: [Visual Studio Build Tools][3] (using "Visual C++ build tools" workload) or [Visual Studio Community][4] (using the "Desktop development with C++" workload).
  - For more details, please refer to the [node-gyp documentation][5].
- Dependencies for MacOS
  `brew install pkg-config pixman cairo pango`
- If you are using linux, run the following command to configure usb.
  ```sh
  wget -q -O - https://raw.githubusercontent.com/Cypherock/cysync-scripts/main/configure-usb.sh | sudo bash
  ```

## Understanding the directory structure

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
│   └── cysync-core         # Contains all business logic of cysync, like pages,context etc
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

## Development Setup

> The repository contains submodules, which need to be downloaded as well.
> Clone the repository along with its submodules using -

```sh
git clone git@github.com:Cypherock/cypherock-cysync.git --recurse-submodules
```

### Local setup

Once you have cloned the repository, follow these steps -

```sh
pnpm i         # Install packages
pnpm start     # Start desktop application
pnpm start -s  # Start desktop application with short log format
```

### Other commands

- `pnpm test`: Run all tests
- `pnpm lint`: Lint all files
- `pnpm pretty`: Prettify all files
- `pnpm build:submodules`: Build submodules if you are changing them

- Desktop App
    - `pnpm start`: Start desktop application (Hot reload enabled)
    - `pnpm make`: Created packaged desktop application

- CLI App
    - `pnpm dev:cli -- <ARGS>`: Run cli application
    - `pnpm make:cli`: Created packaged cli application
        - NOTE: You need to install `pkg` via `npm i -g pkg` before running `pnpm make:cli`

### Editing submodules

- Submodules are contains in `submodules` folder.
- Submodules are packages which are used by `CySync` but are managed in a different
  repository. (Example: [`sdk`](https://github.com/Cypherock/sdk))
- When you edit something in the `submodules`, you'll need to run `pnpm build:submodues`
  to see the changes on cysync apps.
- You may have to delete the `./apps/desktop/node_modules/.vite` folder if the
  changes does not reflect on cysync apps.

### Turorepo Remote Caching

- Create a new file `.turbo/config.json` and add the following content -
  ```json
  {
    "teamid": "team_<TEAMID>",
    "apiurl": "<CACHE API URL>"
  }
  ```
- Set the `TURBO_TOKEN=yourToken` environment variable

## Contributing

Please consider making a contribution to the project. Contributions can include bug fixes, feature proposal, or optimizations to the current code.

- [CONTRIBUTING.md](./docs/CONTRIBUTING.md)
- [CODING_GUIDELINES.md](./docs/CODING_GUIDELINES.md)

[1]: https://nodejs.org/en/download/package-manager/#nvm 'How to use NVM'
[2]: https://pnpm.io/ 'Pnpm documentation'
[3]: https://visualstudio.microsoft.com/thank-you-downloading-visual-studio/?sku=BuildTools 'MS VS Build Tools'
[4]: https://visualstudio.microsoft.com/thank-you-downloading-visual-studio/?sku=Community 'MS VS Community'
[5]: https://github.com/nodejs/node-gyp 'node-gyp documentation'
[6]: https://github.com/nodejs/node-gyp#on-windows 'Configure node-gyp on Windows'
[7]: https://www.python.org/downloads 'Download Python'
