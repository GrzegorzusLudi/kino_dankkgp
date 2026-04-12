import createConfig from '@chris.araneo/eslint-config';

const jsons = [
  '.vscode/*.json',
  'apps/browser/public/**/*.json',
  'scripts/**/*.json',
  'apps/browser/src/**/*.json',
  '.prettierrc.json',
  'nx.json',
  'tsconfig.base.json',
  'tsconfig.json',
  'apps/browser/tsconfig.json',
  'apps/browser/tsconfig.app.json',
  'apps/browser/tsconfig.spec.json',
];

const sources = ['^apps\/browser\/src\/.*(?<!\.spec)\.ts$'];

const tests = ['^.*\.spec\.ts$'];

const templates = ['apps/browser/src/**/*.html'];

const ignored = [
  '.angular/',
  '.stryker-tmp/',
  'dist/',
  'node_modules/',
  'reports/',
  'package.json',
  'package-lock.json',
];

const config = createConfig({
  jsons,
  sources,
  tests,
  templates,
  ignored,
  isAngularApp: true,
  angularElementPrefix: 'app',
});

export default config.map(conf => {
  if (conf.files?.some(file => file.includes('*.html'))) {
    return {
      ...conf,
      rules: {
        ...conf.rules,
        '@angular-eslint/template/no-call-expression': 'off'
      }
    };
  }
  return conf;
});