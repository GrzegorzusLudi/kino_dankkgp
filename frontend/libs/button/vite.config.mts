/// <reference types='vitest' />
import { resolve } from 'node:path';
import { defineConfig } from 'vite';
import angular from '@analogjs/vite-plugin-angular';
import { nxViteTsPaths } from '@nx/vite/plugins/nx-tsconfig-paths.plugin';

export default defineConfig(() => ({
  root: __dirname,
  cacheDir: '../../node_modules/.vite/libs/button',
  plugins: [angular(), nxViteTsPaths()],
  css: {
    preprocessorOptions: {
      scss: {
        loadPaths: [resolve(__dirname, '../../apps/browser/src/app/styles')],
      },
    },
  },
  test: {
    name: 'button',
    watch: false,
    globals: true,
    environment: 'jsdom',
    include: ['{src,tests}/**/*.{test,spec}.{js,mjs,cjs,ts,mts,cts}'],
    setupFiles: ['src/test-setup.ts'],
    reporters: ['default'],
    coverage: {
      reportsDirectory: '../../coverage/libs/button',
      provider: 'v8' as const,
    },
  },
}));
