import { configBuilder } from '@chris.araneo/eslint-config';

const JSONS = [
  '.vscode/*.json',
  '.prettierrc.json',
  'nx.json',
  'tsconfig.base.json',
  'tsconfig.json',
];

const SOURCES = [
  'scripts/build.ts',
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

export default configBuilder()
  .addJsonConfig({ jsons: JSONS })
  .addTypeScriptConfig({ sources: SOURCES, tsconfigRootDir: import.meta.dirname })
  .addIgnored({ ignored: IGNORED })
  .build();