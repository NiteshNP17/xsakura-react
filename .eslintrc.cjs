module.exports = {
  root: true,
  env: { browser: true, es2020: true },
  extends: [
    "eslint:recommended",
    "plugin:@typescript-eslint/recommended",
    "plugin:react-hooks/recommended",
    "plugin:react/recommended",
    "plugin:react/jsx-runtime", // Add this for modern React with JSX transform
  ],
  ignorePatterns: ["dist", ".eslintrc.cjs"],
  parser: "@typescript-eslint/parser",
  parserOptions: {
    ecmaVersion: 2020,
    sourceType: "module",
    ecmaFeatures: {
      jsx: true,
    },
    project: "./tsconfig.json", // Point to your tsconfig.json
  },
  plugins: [
    "react-refresh",
    "eslint-plugin-react-compiler",
    "react",
    "@typescript-eslint",
  ],
  settings: {
    react: {
      version: "detect",
    },
  },
  rules: {
    "react-refresh/only-export-components": [
      "warn",
      { allowConstantExport: true },
    ],
    "react-compiler/react-compiler": "error",
    "react/jsx-key": [
      "error",
      {
        // Upgrade to error for visibility
        checkFragmentShorthand: true,
        checkKeyMustBeforeSpread: true,
      },
    ],
    "react/prop-types": "off",
  },
};
