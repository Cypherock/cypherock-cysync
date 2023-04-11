module.exports = {
  packagerConfig: {},
  rebuildConfig: {},
  makers: [
    {
      name: "@electron-forge/maker-squirrel",
      config: {},
    },
    {
      name: "@electron-forge/maker-zip",
      platforms: ["darwin"],
    },
    {
      name: "@electron-forge/maker-deb",
      config: {},
    },
    {
      name: "@electron-forge/maker-rpm",
      config: {},
    },
  ],
  plugins: [
    {
      name: "@electron-forge/plugin-vite",
      config: {
        build: [
          {
            entry: "src/main.ts",
            config: "./config/vite/vite.main.config.mjs",
          },
          // loader screen
          // {
          //   entry: 'src/preload.js',
          //   config: './config/vite/vite.preload.config.mjs',
          // },
        ],
        renderer: [
          // The first item will be used as the main entry.
          {
            name: "main_window",
            entry: "src/renderer.ts",
            config: "./config/vite/vite.renderer.config.mjs",
          },
        ],
      },
    },
  ],
};
