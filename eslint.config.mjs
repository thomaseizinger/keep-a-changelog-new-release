// eslint.config.js
import { defineConfig, globalIgnores } from "eslint/config";

import github from "eslint-plugin-github";
import eslint from "@eslint/js";
import tseslint from "typescript-eslint";

export default defineConfig([
  eslint.configs.recommended,
  tseslint.configs.recommended,
  tseslint.configs.stylistic,
  {
    languageOptions: {
      ecmaVersion: 9,
      sourceType: "module"
    }
  },
  {
    rules: {
      "@typescript-eslint/no-unused-vars": [
        "error",
        { argsIgnorePattern: "^_" }
      ]
    }
  },
  {
    plugins: { github }
  },
  globalIgnores(["dist/", "lib/", "node_modules/"])
]);
