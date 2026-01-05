import createConfig from '@chris.araneo/eslint-config';

const jsons = [
  '.vscode/*.json',
  'public/**/*.json',
  'scripts/**/*.json',
  'src/**/*.json',
  '.prettierrc.json',
  'angular.json',
  'tsconfig.app.json',
  'tsconfig.json',
  'tsconfig.spec.json',
];

const sources = ['^src\/.*(?<!\.spec)\.ts$'];

const tests = ['^.*\.spec\.ts$'];

const templates = ['src/**/*.html'];

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