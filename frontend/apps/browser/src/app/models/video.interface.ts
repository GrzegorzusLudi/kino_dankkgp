import { VotingData } from './voting-data.interface';

export interface Video {
  id: number;
  url: string;
  videoId: string;
  title: string;
  type: string;
  user: {
    nick: string;
    num: number;
  };
  duration_in_seconds: number;
  move_up_voting: VotingData;
  skip_voting: VotingData;
}
