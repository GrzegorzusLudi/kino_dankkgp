import { inject, Injectable } from '@angular/core';
import { attempt, get, isArray, isError, isObject, noop } from 'lodash-es';
import { BehaviorSubject, Observable } from 'rxjs';
import { match, P } from 'ts-pattern';

import { SOCKET } from '../../app.config';
import { getOrThrow } from 'utils';
import { Action } from '../../models/action.enum';
import { Event } from '../../models/event.enum';
import { Message } from '../../models/message.interface';
import { StateChangeData } from '../../models/state-change-data.interface';
import { Queue } from '../../models/queue.interface';
import { Video } from '../../models/video.interface';
import { VotingData } from '../../models/voting-data.interface';
import { ToastService } from '../toast/toast.service';

const { nullish, when } = P;

@Injectable({
  providedIn: 'root',
})
export class ApiService {
  private readonly messagesSubject = new BehaviorSubject<Message[]>([]);
  private readonly usernameSubject = new BehaviorSubject<string>('');
  private readonly usernamesSubject = new BehaviorSubject<string[]>([]);
  private readonly queueSubject = new BehaviorSubject<Queue | undefined>(
    undefined,
  );

  private readonly socket = inject(SOCKET);
  private readonly toastService = inject(ToastService);

  constructor() {
    this.socket.on(Event.Message, (event: { data?: string }) => {
      match(attempt(() => this.handleMessageEvent(event)))
        .with(when(isError), (error) => {
          console.error(error);
          this.toastService.next({
            title: 'Error',
            message: `Failed to process message event: ${String(error)}`,
            variant: 'danger',
          });
        })
        .otherwise(noop);
    });

    this.socket.on(Event.StateChange, (event: { data?: StateChangeData }) => {
      match(attempt(() => this.handleStateChangeEvent(event)))
        .with(when(isError), (error) => {
          console.error(error);
          this.toastService.next({
            title: 'Error',
            message: `Failed to process state change: ${String(error)}`,
            variant: 'danger',
          });
        })
        .otherwise(noop);
    });

    this.socket.on(Event.Error, (event: { data?: string }) => {
      console.error(event);
      this.toastService.next({
        title: 'Error',
        message: `${String(event.data)}`,
        variant: 'danger',
      });
    });
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

  get queue(): Observable<Queue | undefined> {
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

  voteToMoveVideoUp(id: number, value: boolean): void {
    this.socket.emit(Action.MoveVideoUp, { data: { id, value } });
  }

  voteToSkipVideo(id: number, value: boolean): void {
    this.socket.emit(Action.SkipVideo, { data: { id, value } });
  }

  private handleMessageEvent(event: { data?: string }): void {
    this.toastService.next({
      title: 'Success',
      message: event.data ?? '',
      variant: 'success',
    });
  }

  private handleStateChangeEvent(event: { data?: StateChangeData }): void {
    match(this.mapMessages(event.data?.messages))
      .with(nullish, noop)
      .otherwise((messages) => this.messagesSubject.next(messages));

    match(this.extractUsernames(event.data?.users))
      .with(nullish, noop)
      .otherwise((usernames) => this.usernamesSubject.next(usernames));

    match(this.toQueue(event.data?.queue))
      .with(nullish, noop)
      .otherwise((queue) => this.queueSubject.next(queue));
  }

  private mapMessages(
    messages: StateChangeData['messages'],
  ): Message[] | undefined {
    return isArray(messages)
      ? messages.map((item) => ({
          username: getOrThrow(item, 'nick') ?? '',
          text: getOrThrow(item, 'message') ?? '',
          date: new Date(
            `${getOrThrow(item, 'date') ?? ''} ${getOrThrow(item, 'time') ?? ''}`,
          ),
        }))
      : undefined;
  }

  private extractUsernames(
    users: StateChangeData['users'],
  ): string[] | undefined {
    return isObject(users)
      ? Object.values(users)
          .map((value) => value.nick ?? '')
          .filter(Boolean)
      : undefined;
  }

  private toQueue(queue: Queue | undefined): Queue | undefined {
    return isObject(queue)
      ? {
          videos: this.mapQueueVideos(queue.videos),
          currentlyPlayedVideo:
            get(queue, 'currentlyPlayedVideo') || undefined,
          currentlyPlayedSecond: get(queue, 'currentlyPlayedSecond', 0),
        }
      : undefined;
  }

  private mapQueueVideos(videos: Video[] | undefined): Video[] {
    return isArray(videos)
      ? videos.map((item) => ({
          id: getOrThrow(item, 'id'),
          url: getOrThrow(item, 'url'),
          videoId: getOrThrow(item, 'videoId'),
          title: getOrThrow(item, 'title'),
          type: getOrThrow(item, 'type'),
          user: {
            nick: getOrThrow(item.user, 'nick'),
            num: getOrThrow(item.user, 'num'),
          },
          duration_in_seconds: getOrThrow(item, 'duration_in_seconds'),
          move_up_voting: this.parseVotingData(item.move_up_voting),
          skip_voting: this.parseVotingData(item.skip_voting),
        }))
      : [];
  }

  private parseVotingData(raw: unknown): VotingData {
    return isObject(raw)
      ? {
          you_voted: Boolean(get(raw, 'you_voted', false)),
          user_number_voted: Number(get(raw, 'user_number_voted', 0)),
          user_number_to_have_majority: Number(
            get(raw, 'user_number_to_have_majority', 0),
          ),
        }
      : {
          you_voted: false,
          user_number_voted: 0,
          user_number_to_have_majority: 0,
        };
  }
}
