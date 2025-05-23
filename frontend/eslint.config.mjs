import createConfig from '@chris.araneo/eslint-config';

const jsons = [
  'tsconfig.json',
  'tsconfig.app.json',
  'tsconfig.spec.json',
  'package.json',
  '.prettierrc.json',
  'scripts.config.json',
  'angular.json',
  'src/**/*.json',
  'public/**/*.json',
  '.vscode/*.json',
];

const sources = ['*.{ts,js,mjs,cjs}', 'src/**/*.ts', 'scripts/**/*.js'];

const htmls = ['src/**/*.html'];

const ignoredFiles = [
  'node_modules/',
  'reports/',
  'dist/',
  '.stryker-tmp/',
  '.angular',
  'package.json',
  'package-lock.json',
];

export default createConfig(jsons, sources, htmls, ignoredFiles);
