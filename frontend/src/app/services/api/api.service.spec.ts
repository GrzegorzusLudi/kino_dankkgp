/* eslint-disable @typescript-eslint/prefer-destructuring */
/* eslint-disable max-lines-per-function */
/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-unsafe-call */
/* eslint-disable @typescript-eslint/no-unsafe-function-type */
/* eslint-disable @typescript-eslint/no-unsafe-return */
/* eslint-disable @typescript-eslint/no-magic-numbers */
/* eslint-disable @typescript-eslint/no-non-null-assertion */

import { TestBed } from '@angular/core/testing';

import { SOCKET } from '../../app.config';
import { Action } from '../../models/action.enum';
import { Event } from '../../models/event.enum';
import { ApiService } from './api.service';

describe('ApiService', () => {
  let service: ApiService;
  let mockSocket: any;

  beforeEach(() => {
    mockSocket = {
      emit: jasmine.createSpy('emit'),
      on: jasmine.createSpy('on'),
    };

    TestBed.configureTestingModule({
      providers: [ApiService, { provide: SOCKET, useValue: mockSocket }],
    });

    service = TestBed.inject(ApiService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should register socket listeners on init', () => {
    expect(mockSocket.on).toHaveBeenCalledWith(
      Event.Message,
      jasmine.any(Function),
    );
    expect(mockSocket.on).toHaveBeenCalledWith(
      Event.Error,
      jasmine.any(Function),
    );
    expect(mockSocket.on).toHaveBeenCalledWith(
      Event.StateChange,
      jasmine.any(Function),
    );
  });

  describe('#setUsername', () => {
    it('should emit SetUsername and update usernameSubject on callback', () => {
      const username = 'test-user';
      let callback: () => void;

      mockSocket.emit.and.callFake((_: any, __: any, cb: () => void) => {
        callback = cb;
      });

      service.setUsername(username);
      callback!();

      service.username.subscribe((value) => {
        expect(value).toBe(username);
      });
    });
  });

  describe('#sendMessage', () => {
    it('should emit SendMessage with message data', () => {
      const message = 'Hello world';
      service.sendMessage(message);
      expect(mockSocket.emit).toHaveBeenCalledWith(Action.SendMessage, {
        data: message,
      });
    });
  });

  describe('#addVideoToQueue', () => {
    it('should emit AddVideo with video id', () => {
      const videoId = 'abc123';
      service.addVideoToQueue(videoId);
      expect(mockSocket.emit).toHaveBeenCalledWith(Action.AddVideo, {
        data: videoId,
      });
    });
  });

  describe('event handlers', () => {
    let stateChangeHandler: Function;
    let errorHandler: Function;

    beforeEach(() => {
      const calls = mockSocket.on.calls.allArgs();
      stateChangeHandler = calls.find(
        (events: Event[]) => events[0] === Event.StateChange,
      )![1];
      errorHandler = calls.find((events: Event[]) => events[0] === Event.Error)![1];
    });

    it('should parse messages and usernames from StateChange and update subjects', () => {
      const fakeEvent = {
        data: {
          messages: [
            {
              nick: 'user1',
              message: 'Hi',
              date: '2023-01-01',
              time: '12:00:00',
            },
          ],
          users: {
            id1: { nick: 'user1' },
            id2: { nick: 'user2' },
          },
        },
      };

      stateChangeHandler(fakeEvent);

      service.messages.subscribe((messages) => {
        expect(messages.length).toBe(1);
        expect(messages[0].username).toBe('user1');
      });

      service.usernames.subscribe((usernames) => {
        expect(usernames).toEqual(['user1', 'user2']);
      });
    });

    it('should throw an error on Error event', () => {
      const fakeErrorEvent = { data: 'Something went wrong' };
      expect(() => errorHandler(fakeErrorEvent)).toThrowError(
        'Socket error: Something went wrong',
      );
    });
  });
});
