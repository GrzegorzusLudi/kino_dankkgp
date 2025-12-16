import { TestBed } from '@angular/core/testing';
import { Subscription, take } from 'rxjs';

import { SOCKET } from '../../app.config';
import { Action } from '../../models/action.enum';
import { Event } from '../../models/event.enum';
import { Message } from '../../models/message.interface';
import { Queue } from '../../models/queue.interface';
import { ApiService } from './api.service';

describe('ApiService', () => {
  let service: ApiService;
  let mockSocket: jasmine.SpyObj<any>;
  let subscription: Subscription;

  beforeEach(() => {
    mockSocket = jasmine.createSpyObj('Socket', ['emit', 'on']);

    TestBed.configureTestingModule({
      providers: [ApiService, { provide: SOCKET, useValue: mockSocket }],
    });

    service = TestBed.inject(ApiService);
  });

  afterEach(() => {
    subscription?.unsubscribe();
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  describe('initialization', () => {
    it('should register listener for Message event', () => {
      expect(mockSocket.on).toHaveBeenCalledWith(
        Event.Message,
        jasmine.any(Function),
      );
    });

    it('should register listener for StateChange event', () => {
      expect(mockSocket.on).toHaveBeenCalledWith(
        Event.StateChange,
        jasmine.any(Function),
      );
    });

    it('should register listener for Error event', () => {
      expect(mockSocket.on).toHaveBeenCalledWith(
        Event.Error,
        jasmine.any(Function),
      );
    });
  });

  describe('observables', () => {
    it('should emit empty array as initial messages value', (done) => {
      subscription = service.messages.pipe(take(1)).subscribe((messages) => {
        expect(messages).toEqual([]);
        done();
      });
    });

    it('should emit empty string as initial username value', (done) => {
      subscription = service.username.pipe(take(1)).subscribe((username) => {
        expect(username).toBe('');
        done();
      });
    });

    it('should emit empty array as initial usernames value', (done) => {
      subscription = service.usernames.pipe(take(1)).subscribe((usernames) => {
        expect(usernames).toEqual([]);
        done();
      });
    });

    it('should emit null as initial queue value', (done) => {
      subscription = service.queue.pipe(take(1)).subscribe((queue) => {
        expect(queue).toBeNull();
        done();
      });
    });

    it('should emit null as initial error value', (done) => {
      subscription = service.error.pipe(take(1)).subscribe((error) => {
        expect(error).toBeNull();
        done();
      });
    });
  });

  describe('#setUsername', () => {
    it('should emit SetUsername action with username data', () => {
      const username = 'test-user';

      service.setUsername(username);

      expect(mockSocket.emit).toHaveBeenCalledWith(
        Action.SetUsername,
        { data: username },
        jasmine.any(Function),
      );
    });

    it('should update username subject when callback is invoked', (done) => {
      const username = 'test-user';
      mockSocket.emit.and.callFake(
        (_action: any, _data: any, callback: () => void) => {
          callback();
        },
      );

      service.setUsername(username);

      subscription = service.username.pipe(take(1)).subscribe((value) => {
        expect(value).toBe(username);
        done();
      });
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
      const calls = mockSocket.on.calls.allArgs();
      messageHandler = calls.find(
        (args: Event[]) => args[0] === Event.Message,
      )?.[1];
      stateChangeHandler = calls.find(
        (args: Event[]) => args[0] === Event.StateChange,
      )?.[1];
      errorHandler = calls.find(
        (args: Event[]) => args[0] === Event.Error,
      )?.[1];
    });

    describe('Message event', () => {
      it('should handle message event', () => {
        const event = { data: 'Test message' };
        spyOn(console, 'log');

        expect(() => messageHandler(event)).not.toThrow();
        expect(console.log).toHaveBeenCalledWith('Message', event);
      });

      it('should handle malformed message event gracefully', (done) => {
        const event = {};
        spyOn(console, 'error');

        messageHandler(event);

        subscription = service.error.pipe(take(1)).subscribe((error) => {
          expect(console.error).toHaveBeenCalled();
          expect(error).toContain('Failed to process message event');
          done();
        });
      });
    });

    describe('StateChange event', () => {
      it('should parse and update messages from StateChange event', (done) => {
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

        subscription = service.messages
          .pipe(take(1))
          .subscribe((messages: Message[]) => {
            expect(messages.length).toBe(2);
            expect(messages[0].username).toBe('user1');
            expect(messages[0].text).toBe('Hello');
            expect(messages[0].date).toEqual(new Date('2023-01-01 12:00:00'));
            expect(messages[1].username).toBe('user2');
            expect(messages[1].text).toBe('Hi there');
            done();
          });
      });

      it('should parse and update usernames from StateChange event', (done) => {
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

        subscription = service.usernames
          .pipe(take(1))
          .subscribe((usernames: string[]) => {
            expect(usernames).toEqual(['user1', 'user2', 'user3']);
            done();
          });
      });

      it('should filter out empty usernames', (done) => {
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

        subscription = service.usernames
          .pipe(take(1))
          .subscribe((usernames: string[]) => {
            expect(usernames).toEqual(['user1', 'user3']);
            done();
          });
      });

      it('should parse and update queue from StateChange event', (done) => {
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

        subscription = service.queue
          .pipe(take(1))
          .subscribe((queue: Queue | null) => {
            expect(queue).not.toBeNull();
            expect(queue!.videos.length).toBe(2);
            expect(queue!.videos[0].videoId).toBe('vid1');
            expect(queue!.videos[0].title).toBe('Video 1');
            expect(queue!.videos[0].user.nick).toBe('user1');
            expect(queue!.videos[1].videoId).toBe('vid2');
            expect(queue!.currentlyPlayedVideo).toBeNull();
            expect(queue!.currentlyPlayedSecond).toBe(45);
            done();
          });
      });

      it('should handle queue with empty videos array', (done) => {
        const event = {
          data: {
            queue: {
              videos: [],
              currentlyPlayedVideo: null,
              currentlyPlayedSecond: 0,
            },
          },
        };

        stateChangeHandler(event);

        subscription = service.queue
          .pipe(take(1))
          .subscribe((queue: Queue | null) => {
            expect(queue).not.toBeNull();
            expect(queue!.videos).toEqual([]);
            expect(queue!.currentlyPlayedVideo).toBeNull();
            expect(queue!.currentlyPlayedSecond).toBe(0);
            done();
          });
      });

      it('should handle StateChange event with missing data fields', () => {
        const event = { data: {} };

        expect(() => stateChangeHandler(event)).not.toThrow();
      });

      it('should handle StateChange event with null data', () => {
        const event = { data: null };

        expect(() => stateChangeHandler(event)).not.toThrow();
      });

      it('should update error subject on StateChange processing error', (done) => {
        const event = {
          data: {
            messages: [{ invalid: 'structure' }],
          },
        };
        spyOn(console, 'error');

        stateChangeHandler(event);

        subscription = service.error.pipe(take(1)).subscribe((error) => {
          expect(console.error).toHaveBeenCalled();
          expect(error).toContain('Failed to process state change');
          done();
        });
      });
    });

    describe('Error event', () => {
      it('should update error subject with error message', (done) => {
        const errorMessage = 'Something went wrong';
        const event = { data: errorMessage };

        errorHandler(event);

        subscription = service.error.pipe(take(1)).subscribe((error) => {
          expect(error).toBe(errorMessage);
          done();
        });
      });

      it('should handle error event with missing data', (done) => {
        const event = {};

        errorHandler(event);

        subscription = service.error.pipe(take(1)).subscribe((error) => {
          expect(error).toBe('Unknown error');
          done();
        });
      });

      it('should handle error event with null data', (done) => {
        const event = { data: null };

        errorHandler(event);

        subscription = service.error.pipe(take(1)).subscribe((error) => {
          expect(error).toBe('Unknown error');
          done();
        });
      });
    });
  });
});
