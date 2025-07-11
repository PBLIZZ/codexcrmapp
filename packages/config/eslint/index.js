// @ts-check
import eslint from "@eslint/js";
import nextPlugin from "@next/eslint-plugin-next";
import queryPlugin from "@tanstack/eslint-plugin-query";
import prettierConfig from "eslint-config-prettier";
import importPlugin from "eslint-plugin-import";
import reactPlugin from "eslint-plugin-react";
import hooksPlugin from "eslint-plugin-react-hooks";
import tseslint from "typescript-eslint";

// Base configuration applied to all files
export const baseConfig = tseslint.config(
  { ignores: ["**/dist/**", "**/.next/**", "**/node_modules/**"] },
  eslint.configs.recommended,
  ...tseslint.configs.recommended,
  {
    plugins: { import: importPlugin },
    rules: {
      "import/no-relative-packages": "error",
    },
  },
  {
    plugins: { react: reactPlugin },
    rules: {
      ...reactPlugin.configs.recommended.rules,
      "react/react-in-jsx-scope": "off",
    },
    settings: { react: { version: "detect" } },
  },
  {
    plugins: { "react-hooks": hooksPlugin },
    rules: hooksPlugin.configs.recommended.rules,
  },
  {
    plugins: { "@tanstack/query": queryPlugin },
    rules: queryPlugin.configs.recommended.rules,
  },
  prettierConfig // Must be last to override other formatting rules
);

// Specific configuration for the Next.js app
export const nextjsConfig = tseslint.config({
  files: ["apps/web/**/*.{ts,tsx}"],
  plugins: { "@next/next": nextPlugin },
  rules: {
    ...nextPlugin.configs.recommended.rules,
    ...nextPlugin.configs["core-web-vitals"].rules,
  },
});