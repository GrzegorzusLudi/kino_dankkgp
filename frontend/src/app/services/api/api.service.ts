import { Injectable } from '@angular/core';
import { isArray } from 'lodash';
import { BehaviorSubject, Observable } from 'rxjs';
import { io, Socket } from 'socket.io-client';

import { environment } from '../../../environments/environment';
import { getOrThrow } from '../../functions/get-or-throw.function';
import { Action } from '../../models/action.enum';
import { Event } from '../../models/event.enum';
import { Message } from '../../models/message.interface';
import { StateChangeData } from '../../models/state-change-data.interface';

@Injectable({
  providedIn: 'root',
})
export class ApiService {
  private readonly messagesSubject = new BehaviorSubject<Message[]>([]);
  private readonly socket: Socket;

  constructor() {
    this.socket = io(environment.api.url);

    this.socket.on(Event.Message, (event: { data?: string }) => {
      this.handleMessageEvent(event);
    });

    this.socket.on(Event.Error, (event: { data?: string }) => {
      this.handleErrorEvent(event);
    });

    this.socket.on(Event.StateChange, (event: { data?: StateChangeData }) =>
      this.handleStateChangeEvent(event),
    );
  }

  get messages(): Observable<Message[]> {
    return this.messagesSubject.asObservable();
  }

  setUsername(username: string): void {
    this.socket.emit(Action.SetUsername, { data: username });
  }

  sendMessage(message: string): void {
    this.socket.emit(Action.SendMessage, { data: message });
  }

  addVideoToQueue(id: string): void {
    this.socket.emit(Action.AddVideo, { data: id });
  }

  private handleMessageEvent(event: { data?: string }): void {
    // TODO Display toast
    // eslint-disable-next-line no-console
    console.log('Message', event);
  }

  private handleErrorEvent(event: { data?: string }): void {
    throw new Error(`Socket error: ${event.data}`);
  }

  private handleStateChangeEvent(event: { data?: StateChangeData }): void {
    const messages = event.data?.messages;

    if (isArray(messages)) {
      this.messagesSubject.next(
        messages.map((item) => ({
          username: getOrThrow(item, 'nick') ?? '',
          text: getOrThrow(item, 'message') ?? '',
          date: new Date(
            `${getOrThrow(item, 'date') ?? ''} ${getOrThrow(item, 'time') ?? ''}`,
          ),
        })),
      );
    } else {
      this.messagesSubject.next([]);
    }
  }
}
