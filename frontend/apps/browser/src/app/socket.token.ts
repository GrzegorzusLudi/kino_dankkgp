import { InjectionToken } from '@angular/core';
import { Socket } from 'socket.io-client';

export const SOCKET = new InjectionToken<Socket>('Socket');
