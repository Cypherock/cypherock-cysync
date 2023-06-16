# CySync Core

- Contains all pages of CySync application
- Contains all the business logic for CySync
- All dependencies like `database`, `deviceConnection` etc should be injected
  and not imported directly into `cysync-core`. This ensures that `cysync-core`
  is not dependent on the exact implementation of these dependencies and can be
  easily mocked or changed depending on the environment.
