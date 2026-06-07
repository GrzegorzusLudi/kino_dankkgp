import {
  AfterViewInit,
  ChangeDetectionStrategy,
  Component,
  ElementRef,
  effect,
  input,
  OnDestroy,
  output,
  viewChild,
} from '@angular/core';

import { YouTubePlayer, YouTubePlayerStateEvent } from './youtube-player.types';

import { loadYouTubeIframeApi } from './load-youtube-iframe-api.function';

@Component({
  selector: 'lib-youtube-player',
  template: '<div #host></div>',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class YoutubePlayerComponent implements AfterViewInit, OnDestroy {
  readonly videoId = input.required<string>();
  readonly width = input<number | string>(640);
  readonly height = input<number | string>(390);

  readonly ready = output<YouTubePlayer>();
  readonly change = output<YouTubePlayerStateEvent>();

  private readonly host = viewChild.required<ElementRef<HTMLElement>>('host');

  private player?: YouTubePlayer;
  private destroyed = false;

  constructor() {
    effect(() => {
      const videoId = this.videoId();
      if (this.player && videoId) {
        this.player.loadVideoById(videoId);
      }
    });

    effect(() => {
      const width = this.width();
      const height = this.height();
      this.player?.setSize(width, height);
    });
  }

  ngAfterViewInit(): void {
    loadYouTubeIframeApi().then((api) => {
      if (this.destroyed) {
        return;
      }

      this.player = new api.Player(this.host().nativeElement, {
        videoId: this.videoId(),
        width: this.width(),
        height: this.height(),
        events: {
          onReady: (event: YouTubePlayerStateEvent) =>
            this.ready.emit(event.target),
          onStateChange: (event: YouTubePlayerStateEvent) =>
            this.change.emit(event),
        },
      });
    });
  }

  ngOnDestroy(): void {
    this.destroyed = true;
    this.player?.destroy();
    this.player = undefined;
  }
}
