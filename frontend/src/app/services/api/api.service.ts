import { Inject, Injectable } from '@angular/core';
import { get, isArray, isObject } from 'lodash';
import { BehaviorSubject, Observable } from 'rxjs';
import { Socket } from 'socket.io-client';

import { SOCKET } from '../../app.config';
import { getOrThrow } from '../../functions/get-or-throw.function';
import { Action } from '../../models/action.enum';
import { Event } from '../../models/event.enum';
import { Message } from '../../models/message.interface';
import { StateChangeData } from '../../models/state-change-data.interface';
import { Queue } from '../../models/queue.interface';
import { Video } from '../../models/video.interface';

@Injectable({
  providedIn: 'root',
})
export class ApiService {
  private readonly messagesSubject = new BehaviorSubject<Message[]>([]);
  private readonly usernameSubject = new BehaviorSubject<string>('');
  private readonly usernamesSubject = new BehaviorSubject<string[]>([]);
  private readonly queueSubject = new BehaviorSubject<Queue | null>(null);

  constructor(@Inject(SOCKET) private readonly socket: Socket) {
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

  get username(): Observable<string> {
    return this.usernameSubject.asObservable();
  }

  get usernames(): Observable<string[]> {
    return this.usernamesSubject.asObservable();
  }

  get queue(): Observable<Queue | null> {
    return this.queueSubject.asObservable();
  }

  setUsername(username: string): void {
    this.socket.emit(Action.SetUsername, { data: username }, () => {
      this.usernameSubject.next(username);
    });
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
    }

    const usernames = event.data?.users;

    if (isObject(usernames)) {
      this.usernamesSubject.next(
        Object.values(usernames)
          .map((value) => value.nick ?? '')
          .filter(Boolean),
      );
    }

    const queue = event.data?.queue;

    if (isObject(queue)) {
      const videos: Video[] = isArray(queue.videos)
        ? get(queue, 'videos').map((item) => ({
            url: getOrThrow(item, 'url'),
            videoId: getOrThrow(item, 'videoId'),
            title: getOrThrow(item, 'title'),
            type: getOrThrow(item, 'type'),
            user: {
              nick: getOrThrow(item.user, 'nick'),
              num: getOrThrow(item.user, 'num'),
            },
            duration_in_seconds: getOrThrow(item, 'duration_in_seconds'),
          }))
        : [];

      this.queueSubject.next({
        videos,
        currentlyPlayedVideo: get(queue, 'currentlyPlayedVideo', null),
        currentlyPlayedSecond: get(queue, 'currentlyPlayedSecond', 0),
      });
    }
  }
}
