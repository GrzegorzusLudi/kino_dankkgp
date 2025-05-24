/* eslint-disable no-console */
/* eslint-disable unicorn/prefer-top-level-await */

import { bootstrapApplication } from '@angular/platform-browser';

import { AppComponent } from './app/app.component';
import { appConfig } from './app/app.config';

bootstrapApplication(AppComponent, appConfig).catch((error: unknown) =>
  console.error(error),
);
