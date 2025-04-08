// @ts-check
import withNuxt from "./.nuxt/eslint.config.mjs";
import stylistic from "@stylistic/eslint-plugin";
import tsParser from "@typescript-eslint/parser";
import vueParser from "vue-eslint-parser";
import tseslint from "typescript-eslint";
import jsdoc from "eslint-plugin-jsdoc";

export default withNuxt(
  {
    files: ["**/*.vue"],
    languageOptions: {
      parser: vueParser,
      parserOptions: { parser: tseslint.parser, sourceType: "module" },
    },
  },
  {
    files: ["**/*.ts"],
    plugins: {
      stylistic,
      jsdoc,
    },
    languageOptions: {
      parser: tsParser,
      parserOptions: {
        ecmaVersion: "latest",
        sourceType: "module",
        project: "./tsconfig.json",
        tsconfigRootDir: ".",
      },
    },
    rules: {
      "stylistic/semi": ["error", "never"],
      "stylistic/max-len": ["error", { code: 120 }],
      "stylistic/quotes": ["error", "single"],
      "@typescript-eslint/no-explicit-any": "error",
      // 命名規則
      "@typescript-eslint/naming-convention": [
        "error",
        { selector: "variable", format: ["camelCase", "UPPER_CASE"] },
        { selector: "function", format: ["camelCase"] },
        { selector: "class", format: ["PascalCase"] },
        { selector: "typeAlias", format: ["PascalCase"] },
        { selector: "interface", format: ["PascalCase"] },
        { selector: "typeProperty", format: ["camelCase"] },
        {
          selector: "variable",
          modifiers: ["destructured"],
          format: null,
          leadingUnderscore: "allow",
        },
      ],
    },
  },
  {
    plugins: {
      jsdoc,
    },
    rules: {
      // JSDocルール
      "jsdoc/require-jsdoc": [
        "warn",
        {
          require: {
            ArrowFunctionExpression: false,
            ClassDeclaration: true,
            FunctionDeclaration: true,
            FunctionExpression: true,
            MethodDefinition: true,
          },
        },
      ],
      "jsdoc/require-description": [
        "warn",
        {
          contexts: [
            "ArrowFunctionExpression",
            "ClassDeclaration",
            "FunctionDeclaration",
            "FunctionExpression",
            "MethodDefinition",
          ],
        },
      ],
    },
  },
  // テストファイル用の設定を追加
  {
    files: ["**/*.spec.ts", "**/vitest/**/*.ts"],
    rules: {
      // JSDocルールのみを無効化
      "jsdoc/require-jsdoc": "off",
      "jsdoc/require-description": "off",
      // その他のJSDocルールも無効化
      "jsdoc/check-param-names": "off",
      "jsdoc/check-tag-names": "off",
      "jsdoc/check-types": "off",
    },
  },
  // 無視設定
  {
    ignores: [
      "dist/**",
      "node_modules/**",
      ".nuxt/**",
      ".output/**",
      "**/vitest/**",
    ],
  }
);
