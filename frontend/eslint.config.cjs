/* eslint-disable */

const eslint = require('@eslint/js');
const tseslint = require('typescript-eslint');
const angular = require('angular-eslint');
const eslintPluginJsonc = require('eslint-plugin-jsonc');
const simpleImportSort = require('eslint-plugin-simple-import-sort');
const jsoncParser = require('jsonc-eslint-parser');
const config = require('./scripts.config.json');

module.exports = tseslint.config(
  ...eslintPluginJsonc.configs['flat/recommended-with-jsonc'],
  {
    files: config.lint.jsons,
    languageOptions: {
      parser: jsoncParser,
    },
  },
  {
    files: config.lint.sources,
    extends: [
      eslint.configs.recommended,
      ...tseslint.configs.strict,
      ...tseslint.configs.stylistic,
      ...angular.configs.tsRecommended,
    ],
    processor: angular.processInlineTemplates,
    rules: {
      '@angular-eslint/directive-selector': [
        'error',
        {
          type: 'attribute',
          prefix: 'app',
          style: 'camelCase',
        },
      ],
      '@angular-eslint/component-selector': [
        'error',
        {
          type: 'element',
          prefix: 'app',
          style: 'kebab-case',
        },
      ],
      '@typescript-eslint/no-extraneous-class': 'off',
    },
  },
  {
    files: config.lint.sources,
    plugins: {
      'simple-import-sort': simpleImportSort,
    },
    rules: {
      'simple-import-sort/imports': 'error',
      'simple-import-sort/exports': 'error',
    },
  },
  {
    files: config.lint.htmls,
    extends: [
      ...angular.configs.templateRecommended,
      ...angular.configs.templateAccessibility,
    ],
    rules: {},
  },
  {
    ignores: [
      'node_modules/',
      'reports/',
      '.stryker-tmp/',
      '.angular',
      'package.json',
      'package-lock.json',
    ],
  },
);
