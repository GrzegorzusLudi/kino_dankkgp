import { Queue } from './queue.interface';
import { User } from './user.interface';

export interface StateChangeData {
  messages?: {
    nick?: string;
    message?: string;
    date?: string;
    time?: string;
  }[];
  users?: Record<string, User>;
  queue?: Queue;
}
