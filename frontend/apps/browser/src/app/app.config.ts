import {
  ApplicationConfig,
  InjectionToken,
  provideZoneChangeDetection,
} from '@angular/core';
import { provideRouter } from '@angular/router';
import { io, Socket } from 'socket.io-client';

import { environment } from '../environments/environment';
import { routes } from './app.routes';

export const SOCKET = new InjectionToken<Socket>('Socket');

export const appConfig: ApplicationConfig = {
  providers: [
    provideZoneChangeDetection({ eventCoalescing: true }),
    provideRouter(routes),
    { provide: SOCKET, useValue: io(environment.api.url) },
  ],
};
