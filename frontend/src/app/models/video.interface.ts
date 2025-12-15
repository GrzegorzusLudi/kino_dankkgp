export interface Video {
  url: string;
  videoId: string;
  title: string;
  type: string;
  user: {
    nick: string;
    num: number;
  };
  duration_in_seconds: number;
}
