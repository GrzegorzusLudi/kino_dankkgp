import {
  ApplicationConfig,
  provideZonelessChangeDetection,
} from '@angular/core';
import { provideRouter } from '@angular/router';
import { io } from 'socket.io-client';

import { environment } from '../environments/environment';
import { routes } from './app.routes';
import { SOCKET } from './socket.token';

export const appConfig: ApplicationConfig = {
  providers: [
    provideZonelessChangeDetection(),
    provideRouter(routes),
    { provide: SOCKET, useValue: io(environment.api.url) },
  ],
};
