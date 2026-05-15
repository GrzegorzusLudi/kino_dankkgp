import { defineConfig } from 'vite';
import { nxViteTsPaths } from '@nx/vite/plugins/nx-tsconfig-paths.plugin';
import { dirname, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

export default defineConfig({
  plugins: [
    nxViteTsPaths(),
  ],
  define: {
    STORYBOOK_ANGULAR_OPTIONS: JSON.stringify({ experimentalZoneless: true }),
  },
  css: {
    preprocessorOptions: {
      scss: {
        loadPaths: [resolve(__dirname, '../../../apps/browser/src/app/styles')],
      },
    },
  },
});
