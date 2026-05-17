import { defineConfig } from 'vite';
import angular from '@analogjs/vite-plugin-angular';
import { nxViteTsPaths } from '@nx/vite/plugins/nx-tsconfig-paths.plugin';
import { dirname, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

export default defineConfig({
  plugins: [
    angular({ tsconfig: resolve(__dirname, 'tsconfig.json') }),
    nxViteTsPaths(),
  ],
  define: {
    STORYBOOK_ANGULAR_OPTIONS: JSON.stringify({ experimentalZoneless: true }),
  },

});
