import { Video } from './video.interface';

export interface Queue {
  videos: Video[];
  currentlyPlayedVideo: Video | undefined;
  currentlyPlayedSecond: number;
}
