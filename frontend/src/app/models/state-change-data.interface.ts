export interface StateChangeData {
  messages?: {
    nick?: string;
    message?: string;
    date?: string;
    time?: string;
  }[];
  users?: Record<
    string,
    {
      nick?: string;
      num?: number;
    }
  >;
}
