import * as path from "node:path"
import { fixupConfigRules, fixupPluginRules } from "@eslint/compat"
import { includeIgnoreFile } from "@eslint/config-helpers"
import nextPlugin from "@next/eslint-plugin-next"
import pluginQuery from "@tanstack/eslint-plugin-query"
import prettier from "eslint-config-prettier"
import react from "eslint-plugin-react"
import reactCompiler from "eslint-plugin-react-compiler"
import reactHooks from "eslint-plugin-react-hooks"
import { defineConfig } from "eslint/config"
import tseslint from "typescript-eslint"

const tsFiles = ["**/*.ts", "**/*.tsx"]
const allFiles = ["**/*.js", ...tsFiles]

export default defineConfig([
  // -- Ignore files tracked by VCS and specific config/types
  includeIgnoreFile(path.join(import.meta.dirname, ".gitignore")),
  { ignores: ["**/*.config.*", "next-env.d.ts"] },

  // -- Base TypeScript and JavaScript Configuration
  {
    files: allFiles,
    languageOptions: {
      parser: tseslint.parser,
      parserOptions: { projectService: true },
    },
    plugins: { "@typescript-eslint": tseslint.plugin },
    rules: {
      // Base JavaScript rules
      "curly": ["error", "all"],
      "eqeqeq": "warn",
      "no-console": "warn",
      "no-duplicate-imports": "error",
      "no-eval": "error",
      "no-implied-eval": "error",
      "no-new-func": "error",
      "no-return-await": "warn",
      "no-script-url": "error",
      "no-unreachable": "warn",
      "no-unused-expressions": "error",
      "no-var": "error",
      "object-shorthand": "error",
      "prefer-const": "error",
      "prefer-template": "warn",

      // TypeScript-specific rules
      "@typescript-eslint/array-type": "off",
      "@typescript-eslint/consistent-type-definitions": "off",
      "@typescript-eslint/consistent-type-imports": ["warn", { fixStyle: "inline-type-imports" }],
      "@typescript-eslint/no-explicit-any": "warn",
      "@typescript-eslint/no-misused-promises": [
        "error",
        { checksVoidReturn: { attributes: false } },
      ],
      "@typescript-eslint/no-unused-vars": ["warn", { argsIgnorePattern: "^_" }],
      "@typescript-eslint/prefer-nullish-coalescing": "warn",
      "@typescript-eslint/require-await": "warn",
    },
  },

  // -- React and Hooks (Using fixupPluginRules for legacy compatibility)
  {
    files: tsFiles,
    plugins: {
      "react": fixupPluginRules(react),
      "react-hooks": fixupPluginRules(reactHooks),
    },
    settings: {
      react: { version: "detect" },
    },
    rules: {
      ...react.configs.recommended.rules,
      ...reactHooks.configs.flat.recommended.rules,
      "react-hooks/exhaustive-deps": "warn",
      "react-hooks/incompatible-library": "off",
      "react-hooks/purity": "warn",
      "react-hooks/rules-of-hooks": "warn",
      "react-hooks/set-state-in-effect": "warn",
      "react-hooks/static-components": "warn",
      "react-hooks/use-memo": "warn",
      "react/no-children-prop": "off",
      "react/prop-types": "off",
      "react/react-in-jsx-scope": "off",
    },
  },

  // -- Next.js (Using fixupConfigRules to handle legacy Next.js plugin structure)
  ...fixupConfigRules(nextPlugin.configs.recommended).map(config => ({
    ...config,
    files: tsFiles,
  })),

  // -- TanStack Query
  ...pluginQuery.configs["flat/recommended"],

  // -- React Compiler
  {
    files: tsFiles,
    plugins: { "react-compiler": reactCompiler },
    rules: { "react-compiler/react-compiler": "warn" },
  },

  // -- Restricted Environment Access
  {
    files: allFiles,
    rules: {
      "no-restricted-properties": [
        "error",
        {
          object: "process",
          property: "env",
          message: "Use @/env instead of process.env to ensure type safety and validation.",
        },
      ],
    },
  },
  {
    files: ["env.ts", "env.mjs", "src/env.ts"],
    rules: {
      "no-restricted-properties": "off",
    },
  },

  // -- Prettier Integration (Must be last)
  prettier,
])
