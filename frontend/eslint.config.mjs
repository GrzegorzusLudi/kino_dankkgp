import { configBuilder } from '@chris.araneo/eslint-config';

const JSONS = [
  '.vscode/*.json',
  '.prettierrc.json',
  'nx.json',
  'tsconfig.base.json',
  'tsconfig.json',
];

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
  .addIgnored({ ignored: IGNORED })
  .build();