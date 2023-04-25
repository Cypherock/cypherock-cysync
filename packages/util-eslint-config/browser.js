module.exports = {
  env: {
    browser: true,
    es2021: true,
  },
  extends: ["plugin:react/recommended", "airbnb", "prettier"],
  parser: "@typescript-eslint/parser",
  parserOptions: {
    ecmaFeatures: {
      jsx: true,
    },
    ecmaVersion: 12,
    sourceType: "module",
  },
  plugins: ["react", "@typescript-eslint"],
  settings: {
    "import/resolver": {
      typescript: {},
    },
  },
  rules: {
    "import/extensions": 0,
    "import/prefer-default-export": 0,
    "no-await-in-loop": 0,
    "no-restricted-syntax": 0,
    "no-shadow": "off",
    "@typescript-eslint/no-shadow": ["error"],
    "@typescript-eslint/no-explicit-any": "warn",
    "@typescript-eslint/prefer-nullish-coalescing": "error",
    "@typescript-eslint/no-unused-vars": "error",
    "import/no-extraneous-dependencies": [
      "error",
      {
        devDependencies: [
          "**/*.test.ts",
          "**/*.test.tsx",
          "**/tests/**/*.ts",
          "**/__mocks__/**/*.ts",
          "**/__fixtures__/**/*.ts",
        ],
      },
    ],
    "@typescript-eslint/prefer-readonly": "error",

    // React specific
    "react/jsx-filename-extension": [2, { extensions: [".jsx", ".tsx"] }],
    "no-use-before-define": "off",
    "react/function-component-definition": [
      2,
      { namedComponents: "arrow-function" },
    ],
    "react/jsx-props-no-spreading": "off",
  },
};
