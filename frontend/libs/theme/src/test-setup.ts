import '@angular/compiler';
import '@analogjs/vitest-angular/setup-snapshots';
import { setupTestBed } from '@analogjs/vitest-angular/setup-testbed';
import { noop } from 'lodash-es';

Object.defineProperty(window, 'matchMedia', {
  writable: true,
  value: (query: string) => ({
    matches: false,
    media: query,
    onchange: null,
    addListener: noop,
    removeListener: noop,
    addEventListener: noop,
    removeEventListener: noop,
    dispatchEvent: () => false,
  }),
});

setupTestBed({ zoneless: true });
