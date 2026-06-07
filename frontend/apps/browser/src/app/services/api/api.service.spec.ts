import { provideZonelessChangeDetection } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import { noop } from 'lodash-es';
import { firstValueFrom } from 'rxjs';

import { SOCKET } from '../../app.config';
import { Action } from '../../models/action.enum';
import { Event } from '../../models/event.enum';
import { Message } from '../../models/message.interface';
import { Queue } from '../../models/queue.interface';
import { ToastService } from '../toast/toast.service';
import { ApiService } from './api.service';

describe('ApiService', () => {
  let service: ApiService;
  let mockSocket: {
    emit: ReturnType<typeof vi.fn>;
    on: ReturnType<typeof vi.fn>;
  };
  let mockToastService: { next: ReturnType<typeof vi.fn> };

  beforeEach(() => {
    mockSocket = { emit: vi.fn(), on: vi.fn() };
    mockToastService = { next: vi.fn() };

    TestBed.configureTestingModule({
      providers: [
        ApiService,
        { provide: SOCKET, useValue: mockSocket },
        { provide: ToastService, useValue: mockToastService },
        provideZonelessChangeDetection(),
      ],
    });

    service = TestBed.inject(ApiService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  describe('initialization', () => {
    it('should register listener for Message event', () => {
      expect(mockSocket.on).toHaveBeenCalledWith(
        Event.Message,
        expect.any(Function),
      );
    });

    it('should register listener for StateChange event', () => {
      expect(mockSocket.on).toHaveBeenCalledWith(
        Event.StateChange,
        expect.any(Function),
      );
    });

    it('should register listener for Error event', () => {
      expect(mockSocket.on).toHaveBeenCalledWith(
        Event.Error,
        expect.any(Function),
      );
    });
  });

  describe('observables', () => {
    it('should emit empty array as initial messages value', async () => {
      const messages = await firstValueFrom(service.messages);
      expect(messages).toEqual([]);
    });

    it('should emit empty string as initial username value', async () => {
      const username = await firstValueFrom(service.username);
      expect(username).toBe('');
    });

    it('should emit empty array as initial usernames value', async () => {
      const usernames = await firstValueFrom(service.usernames);
      expect(usernames).toEqual([]);
    });

    it('should emit undefined as initial queue value', async () => {
      const queue = await firstValueFrom(service.queue);
      expect(queue).toBeUndefined();
    });
  });

  describe('#setUsername', () => {
    it('should emit SetUsername action with username data', () => {
      const username = 'test-user';

      service.setUsername(username);

      expect(mockSocket.emit).toHaveBeenCalledWith(
        Action.SetUsername,
        { data: username },
        expect.any(Function),
      );
    });

    it('should update username subject when callback is invoked', async () => {
      const username = 'test-user';
      mockSocket.emit.mockImplementation(
        (_action: any, _data: any, callback: () => void) => {
          callback();
        },
      );

      service.setUsername(username);

      const value = await firstValueFrom(service.username);
      expect(value).toBe(username);
    });
  });

  describe('#sendMessage', () => {
    it('should emit SendMessage action with message data', () => {
      const message = 'Hello world';

      service.sendMessage(message);

      expect(mockSocket.emit).toHaveBeenCalledWith(Action.SendMessage, {
        data: message,
      });
    });

    it('should handle empty message', () => {
      const message = '';

      service.sendMessage(message);

      expect(mockSocket.emit).toHaveBeenCalledWith(Action.SendMessage, {
        data: '',
      });
    });
  });

  describe('#addVideoToQueue', () => {
    it('should emit AddVideo action with video id', () => {
      const videoId = 'abc123';

      service.addVideoToQueue(videoId);

      expect(mockSocket.emit).toHaveBeenCalledWith(Action.AddVideo, {
        data: videoId,
      });
    });
  });

  describe('event handlers', () => {
    let messageHandler: (event: any) => void;
    let stateChangeHandler: (event: any) => void;
    let errorHandler: (event: any) => void;

    beforeEach(() => {
      const calls = mockSocket.on.mock.calls as [
        string,
        (...args: any[]) => void,
      ][];
      messageHandler = calls.find((args) => args[0] === Event.Message)?.[1];
      stateChangeHandler = calls.find(
        (args) => args[0] === Event.StateChange,
      )?.[1];
      errorHandler = calls.find((args) => args[0] === Event.Error)?.[1];
    });

    describe('Message event', () => {
      it('should handle message event without throwing', () => {
        const event = { data: 'Test message' };
        expect(() => messageHandler(event)).not.toThrow();
      });

      it('should notify toast on message event', () => {
        const event = { data: 'Test message' };
        messageHandler(event);
        expect(mockToastService.next).toHaveBeenCalledWith(
          expect.objectContaining({
            variant: 'success',
            message: 'Test message',
          }),
        );
      });

      it('should handle message event without data', () => {
        const event = {};
        expect(() => messageHandler(event)).not.toThrow();
      });
    });

    describe('StateChange event', () => {
      it('should parse and update messages from StateChange event', async () => {
        const event = {
          data: {
            messages: [
              {
                nick: 'user1',
                message: 'Hello',
                date: '2023-01-01',
                time: '12:00:00',
              },
              {
                nick: 'user2',
                message: 'Hi there',
                date: '2023-01-01',
                time: '12:05:00',
              },
            ],
          },
        };

        stateChangeHandler(event);

        const messages: Message[] = await firstValueFrom(service.messages);
        expect(messages.length).toBe(2);
        expect(messages[0].username).toBe('user1');
        expect(messages[0].text).toBe('Hello');
        expect(messages[0].date).toEqual(new Date('2023-01-01 12:00:00'));
        expect(messages[1].username).toBe('user2');
        expect(messages[1].text).toBe('Hi there');
      });

      it('should parse and update usernames from StateChange event', async () => {
        const event = {
          data: {
            users: {
              id1: { nick: 'user1' },
              id2: { nick: 'user2' },
              id3: { nick: 'user3' },
            },
          },
        };

        stateChangeHandler(event);

        const usernames = await firstValueFrom(service.usernames);
        expect(usernames).toEqual(['user1', 'user2', 'user3']);
      });

      it('should filter out empty usernames', async () => {
        const event = {
          data: {
            users: {
              id1: { nick: 'user1' },
              id2: { nick: '' },
              id3: { nick: 'user3' },
              id4: {},
            },
          },
        };

        stateChangeHandler(event);

        const usernames = await firstValueFrom(service.usernames);
        expect(usernames).toEqual(['user1', 'user3']);
      });

      it('should parse and update queue from StateChange event', async () => {
        const event = {
          data: {
            queue: {
              videos: [
                {
                  url: 'https://example.com/video1',
                  videoId: 'vid1',
                  title: 'Video 1',
                  type: 'youtube',
                  user: { nick: 'user1', num: 1 },
                  duration_in_seconds: 120,
                },
                {
                  url: 'https://example.com/video2',
                  videoId: 'vid2',
                  title: 'Video 2',
                  type: 'youtube',
                  user: { nick: 'user2', num: 2 },
                  duration_in_seconds: 180,
                },
              ],
              currentlyPlayedVideo: null,
              currentlyPlayedSecond: 45,
            },
          },
        };

        stateChangeHandler(event);

        const queue: Queue | undefined = await firstValueFrom(service.queue);
        expect(queue).not.toBeUndefined();
        expect(queue!.videos.length).toBe(2);
        expect(queue!.videos[0].videoId).toBe('vid1');
        expect(queue!.videos[0].title).toBe('Video 1');
        expect(queue!.videos[0].user.nick).toBe('user1');
        expect(queue!.videos[1].videoId).toBe('vid2');
        expect(queue!.currentlyPlayedVideo).toBeUndefined();
        expect(queue!.currentlyPlayedSecond).toBe(45);
      });

      it('should handle queue with empty videos array', async () => {
        const event = {
          data: {
            queue: {
              videos: [],
              currentlyPlayedVideo: undefined,
              currentlyPlayedSecond: 0,
            },
          },
        };

        stateChangeHandler(event);

        const queue: Queue | undefined = await firstValueFrom(service.queue);
        expect(queue).not.toBeUndefined();
        expect(queue!.videos).toEqual([]);
        expect(queue!.currentlyPlayedVideo).toBeUndefined();
        expect(queue!.currentlyPlayedSecond).toBe(0);
      });

      it('should handle StateChange event with missing data fields', () => {
        const event = { data: {} };
        expect(() => stateChangeHandler(event)).not.toThrow();
      });

      it('should handle StateChange event with null data', () => {
        const event = { data: null };
        expect(() => stateChangeHandler(event)).not.toThrow();
      });

      it('should call console.error and notify toast on StateChange processing error', () => {
        const event = { data: { messages: [{ invalid: 'structure' }] } };
        vi.spyOn(console, 'error').mockImplementation(noop);

        stateChangeHandler(event);

        expect(console.error).toHaveBeenCalled();
        expect(mockToastService.next).toHaveBeenCalledWith(
          expect.objectContaining({
            variant: 'danger',
            message: expect.stringContaining('Failed to process state change'),
          }),
        );
      });
    });

    describe('Error event', () => {
      it('should call console.error and notify toast with error message', () => {
        const errorMessage = 'Something went wrong';
        const event = { data: errorMessage };
        vi.spyOn(console, 'error').mockImplementation(noop);

        errorHandler(event);

        expect(console.error).toHaveBeenCalledWith(event);
        expect(mockToastService.next).toHaveBeenCalledWith(
          expect.objectContaining({ variant: 'danger', message: errorMessage }),
        );
      });

      it('should handle error event without throwing', () => {
        const event = {};
        vi.spyOn(console, 'error').mockImplementation(noop);
        expect(() => errorHandler(event)).not.toThrow();
      });

      it('should handle error event with null data without throwing', () => {
        const event = { data: null };
        vi.spyOn(console, 'error').mockImplementation(noop);
        expect(() => errorHandler(event)).not.toThrow();
      });
    });
  });
});
