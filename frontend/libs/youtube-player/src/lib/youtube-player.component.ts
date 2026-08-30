import {
  afterNextRender,
  ChangeDetectionStrategy,
  Component,
  DestroyRef,
  effect,
  ElementRef,
  inject,
  input,
  output,
  viewChild,
} from '@angular/core';
import { noop } from 'lodash-es';
import { match, P } from 'ts-pattern';

import { loadYouTubeIframeApi } from './load-youtube-iframe-api.function';
import {
  DEFAULT_PLAYER_HEIGHT,
  DEFAULT_PLAYER_WIDTH,
} from './youtube-player.consts';
import { YouTubePlayer, YouTubePlayerStateEvent } from './youtube-player.types';

const { nullish } = P;

@Component({
  selector: 'lib-youtube-player',
  template: '<div #host></div>',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class YoutubePlayerComponent {
  readonly videoId = input<string>();
  readonly width = input<number | string>(DEFAULT_PLAYER_WIDTH);
  readonly height = input<number | string>(DEFAULT_PLAYER_HEIGHT);

  readonly ready = output<YouTubePlayer>();
  readonly change = output<YouTubePlayerStateEvent>();

  private player?: YouTubePlayer;
  private destroyed = false;

  private readonly host = viewChild.required<ElementRef<HTMLElement>>('host');
  private readonly destroyRef = inject(DestroyRef);

  constructor() {
    effect(() => {
      match(this.videoId())
        .with(nullish, noop)
        .otherwise((videoId) =>
          match(this.player)
            .with(nullish, noop)
            .otherwise((player) => player.loadVideoById(videoId)),
        );
    });

    effect(() => {
      this.player?.setSize(this.width(), this.height());
    });

    afterNextRender(() => this.createPlayer());

    this.destroyRef.onDestroy(() => {
      this.destroyed = true;
      this.player?.destroy();
      this.player = undefined;
    });
  }

  private createPlayer(): void {
    void loadYouTubeIframeApi().then((api) =>
      match(this.destroyed)
        .with(true, noop)
        .otherwise(() => {
          this.player = new api.Player(this.host().nativeElement, {
            videoId: this.videoId() ?? '',
            width: this.width(),
            height: this.height(),
            events: {
              onReady: (event: YouTubePlayerStateEvent) =>
                this.ready.emit(event.target),
              onStateChange: (event: YouTubePlayerStateEvent) =>
                this.change.emit(event),
            },
          });
        }),
    );
  }
}
