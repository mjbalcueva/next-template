/** @typedef {import("prettier").Config} PrettierConfig */
/** @typedef {import("prettier-plugin-tailwindcss").PluginOptions} TailwindConfig */
/** @typedef {import("@ianvs/prettier-plugin-sort-imports").PluginConfig} SortImportsConfig */

/**
 * Universal Prettier configuration for all project types
 * Works for: Next.js apps, Node.js APIs, and shared packages
 *
 * @type {PrettierConfig | SortImportsConfig | TailwindConfig}
 */
const config = {
  // Modern formatting preferences
  bracketSameLine: false,
  bracketSpacing: true,
  arrowParens: "avoid",
  endOfLine: "lf",
  printWidth: 100,
  quoteProps: "consistent",
  semi: false,
  singleQuote: false,
  tabWidth: 2,
  trailingComma: "es5",
  useTabs: false,
  proseWrap: "preserve",
  htmlWhitespaceSensitivity: "css",

  // Plugins (Tailwind must be last)
  plugins: [
    "@prettier/plugin-oxc",
    "@ianvs/prettier-plugin-sort-imports",
    "prettier-plugin-tailwindcss",
  ],

  // Tailwind configuration
  tailwindFunctions: ["cn", "cva"],

  // Universal import order that works for all project types
  importOrder: [
    // Framework imports (React, Next.js, Expo, NestJS)
    "^(react/(.*)$)|^(react$)|^(react-native(.*)$)",
    "^(next/(.*)$)|^(next$)",
    "^(expo(.*)$)|^(expo$)",
    "^@nestjs/(.*)$",
    "",
    // Node.js built-in & third-party modules (fs, path, etc.)
    "<BUILTIN_MODULES>",
    "<THIRD_PARTY_MODULES>",
    "",
    // Internal path aliases — @/app (route layer)
    "^@/app/(.*)$",
    "",
    // Internal path aliases — @/core (shared primitives)
    "^@/core/(.*)$",
    "",
    // Internal path aliases — @/features (feature modules)
    "^@/features/(.*)$",
    "",
    // Internal path aliases — @/packages (shared libraries)
    "^@/packages/(.*)$",
    "",
    // Internal path aliases — @/services (third-party integrations)
    "^@/services/(.*)$",
    "",
    // Internal path aliases — catch-all @/
    "^@/(.*)$",
    "",
    // Parent directory imports (deep)
    "^(?:[.][.]/){2,}(?!.*[.]css$)(.*)$",
    "",
    // Parent directory imports
    "^[.][.]/(?!.*[.]css$)(.*)$",
    "",
    // Private module imports
    "^[.]/(?:[(][^)]+[)]/)?_(?!.*[.]css$)(.*)$",
    "",
    // Sibling imports
    "^[.]/(?!.*[.]css$)(.*)$",
    "",
    // Style imports
    "[.]css$",
  ],

  importOrderParserPlugins: ["typescript", "jsx", "decorators-legacy"],
  importOrderTypeScriptVersion: "5.0.0",

  // File-specific overrides
  overrides: [
    {
      files: "*.json.hbs",
      options: {
        parser: "json",
      },
    },
    {
      files: "*.ts.hbs",
      options: {
        parser: "babel",
      },
    },
  ],
}

export default config
