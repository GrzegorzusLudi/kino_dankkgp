import { configBuilder } from '@chris.araneo/eslint-config';

export default configBuilder()
  .addAngularConfig({
    prefix: 'lib',
    sources: [/^(?!.*\.spec\.ts$).*\.ts$/.toString()],
    tests: ['**/*.spec.ts'],
    templates: [],
    jsons: ['**/*.json'],
    ignored: ['eslint.config.mjs', 'vite.config.mts', 'src/test-setup.ts'],
    tsconfigRootDir: import.meta.dirname,
  })
  .build();
