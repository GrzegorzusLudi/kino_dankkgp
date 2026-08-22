import { configBuilder } from '@chris.araneo/eslint-config';

const JSONS = [
  '.vscode/*.json',
  '.prettierrc.json',
  '.stylelintrc.json',
  'nx.json',
  'tsconfig.base.json',
  'tsconfig.json',
];

const SOURCES = [
  'scripts/build.js',
  'eslint.config.mjs',
  'jest.config.ts',
  'jest.preset.js',
  'vitest.workspace.ts',
]

const IGNORED = [
  '.angular/',
  '.nx/cache/',
  '.nx/workspace-data/',
  '.stryker-tmp/',
  'apps/',
  'dist/',
  'libs/',
  'no-paper-needed/',
  'node_modules/',
  'reports/',
  'package.json',
  'package-lock.json',
];

const BASE_CONFIGS = configBuilder()
  .addJsonConfig({ jsons: JSONS })
  .addTypeScriptConfig({ sources: SOURCES, tsconfigRootDir: import.meta.dirname })
  .addIgnored({ ignored: IGNORED })
  .build()
  .map((config) => {
    if (config.languageOptions?.parserOptions?.projectService === true) {
      return {
        ...config,
        languageOptions: {
          ...config.languageOptions,
          parserOptions: {
            ...config.languageOptions.parserOptions,
            projectService: {
              allowDefaultProject: SOURCES,
            },
          },
        },
      };
    }
    return config;
  });

export default [
  ...BASE_CONFIGS,
  {
    files: ['scripts/build.js'],
    rules: {
      'func-style': 'off',
      'max-lines-per-function': 'off',
      'max-statements': 'off',
      'no-console': 'off',
      '@typescript-eslint/naming-convention': 'off',
      '@typescript-eslint/no-magic-numbers': 'off',
    },
  },
  {
    files: ['jest.config.ts'],
    rules: {
      '@typescript-eslint/no-unsafe-assignment': 'off',
      '@typescript-eslint/no-unsafe-call': 'off',
    },
  },
];
