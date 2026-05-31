import { configBuilder } from '@chris.araneo/eslint-config';

export default configBuilder()
  .addTypeScriptConfig({
    sources: [/^(?!.*\.spec\.ts$).*\.ts$/.toString()],
    tsconfigRootDir: import.meta.dirname,
  })
  .addTypeScriptTestsConfig({
    sources: ['**/*.spec.ts'],
    tsconfigRootDir: import.meta.dirname,
  })
  .addJsonConfig({
    jsons: ['**/*.json'],
  })
  .addIgnored({
    ignored: ['eslint.config.mjs', 'vite.config.mts', 'src/test-setup.ts'],
  })
  .build();
