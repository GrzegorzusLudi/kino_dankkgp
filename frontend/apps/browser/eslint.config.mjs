import { configBuilder } from '@chris.araneo/eslint-config';

export default configBuilder()
  .addAngularConfig({
    prefix: 'app',
    sources: [/^(?!.*\.spec\.ts$).*\.ts$/.toString()],
    tests: ['**/*.spec.ts'],
    templates: ['**/*.html'],
    jsons: ['**/*.json'],
    ignored: [
      'eslint.config.mjs',
      'src/environments/**/*.ts',
    ],
    tsconfigRootDir: import.meta.dirname,
  })
  .build()
  .map((conf) => {
    if (conf.files?.some((file) => file.includes('*.html'))) {
      return {
        ...conf,
        rules: {
          ...conf.rules,
          '@angular-eslint/template/no-call-expression': 'off',
        },
      };
    }
    return conf;
  });
