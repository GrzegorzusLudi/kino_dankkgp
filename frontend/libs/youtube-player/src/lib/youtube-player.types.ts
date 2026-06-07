export interface YouTubePlayer {
  loadVideoById(videoId: string, startSeconds?: number): void;
  cueVideoById(videoId: string, startSeconds?: number): void;
  playVideo(): void;
  pauseVideo(): void;
  stopVideo(): void;
  seekTo(seconds: number, allowSeekAhead?: boolean): void;
  getCurrentTime(): number;
  getDuration(): number;
  getPlayerState(): number;
  getIframe(): HTMLIFrameElement;
  setSize(width: number | string, height: number | string): void;
  destroy(): void;
}

export interface YouTubePlayerStateEvent {
  target: YouTubePlayer;
  data: number;
}

export interface YouTubePlayerOptions {
  width?: number | string;
  height?: number | string;
  videoId?: string;
  playerVars?: Record<string, string | number>;
  events?: {
    onReady?: (event: YouTubePlayerStateEvent) => void;
    onStateChange?: (event: YouTubePlayerStateEvent) => void;
  };
}

export interface YouTubeIframeApi {
  Player: new (
    host: HTMLElement | string,
    options: YouTubePlayerOptions,
  ) => YouTubePlayer;
}

export interface YouTubeApiWindow {
  YT?: YouTubeIframeApi;
  onYouTubeIframeAPIReady?: () => void;
}
