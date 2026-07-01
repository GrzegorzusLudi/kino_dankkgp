import { Component, effect, input, OnDestroy } from '@angular/core';
import { BehaviorSubject, debounceTime, Subscription } from 'rxjs';
import { match, P } from 'ts-pattern';
import { noop } from 'lodash-es';

import { ThemedDirective } from 'theme';
import { TextComponent } from 'text';
import { YouTubePlayer, YoutubePlayerComponent } from 'youtube-player';
import {
  DEFAULT_VIDEO_HEIGHT,
  DEFAULT_VIDEO_WIDTH,
  DIMENSIONS_CHANGE_DEBOUNCE_TIME,
} from './video-container.consts';

const { nullish } = P;

// TODO: (change)="onStateChange($event)"

@Component({
  selector: 'app-video-container',
  imports: [TextComponent, YoutubePlayerComponent],
  hostDirectives: [ThemedDirective],
  templateUrl: './video-container.component.html',
  styleUrls: [
    './video-container.aero.component.scss',
    './video-container.flat.component.scss',
  ],
})
export class VideoContainerComponent implements OnDestroy {
  title = input<string>();
  videoId = input<string>();
  second = input<number>();
  width = input(DEFAULT_VIDEO_WIDTH);
  height = input(DEFAULT_VIDEO_HEIGHT);

  private player?: YouTubePlayer;
  private readonly dimensions = new BehaviorSubject([
    `${DEFAULT_VIDEO_WIDTH}px`,
    `${DEFAULT_VIDEO_HEIGHT}px`,
  ]);
  private subscription?: Subscription;

  constructor() {
    effect(() => {
      this.dimensions.next([`${this.width()}px`, `${this.height()}px`]);

      match(this.second())
        .with(nullish, noop)
        .otherwise((second) => this.seekTo(second));
    });
  }

  ngOnDestroy(): void {
    this.subscription?.unsubscribe();
  }

  savePlayer(player: Readonly<YouTubePlayer>): void {
    this.player = player;

    this.subscription = this.dimensions
      .asObservable()
      .pipe(debounceTime(DIMENSIONS_CHANGE_DEBOUNCE_TIME))
      .subscribe(() => {
        this.updateIframeDimensions();
      });
  }

  seekTo(seconds: number, allowSeekAhead = true): void {
    match(this.player)
      .with(P.nullish, () => {
        throw new Error('Player is not initialized');
      })
      .otherwise((player) => {
        const currentRoundedSeconds = Math.round(player.getCurrentTime());

        match(this.shouldSeekTo(currentRoundedSeconds, seconds))
          .with(true, () => player.seekTo(seconds, allowSeekAhead))
          .otherwise(noop);
      });
  }

  private shouldSeekTo(
    currentSeconds: number,
    targetSeconds: number,
    precision = 0.5,
  ): boolean {
    return (
      currentSeconds <= targetSeconds - precision ||
      currentSeconds >= targetSeconds + precision
    );
  }

  private updateIframeDimensions(): void {
    match(this.player?.getIframe())
      .with(P.nullish, () => {
        throw new Error('Video iframe is undefined');
      })
      .otherwise((iframe) => {
        const [width, height] = this.dimensions.getValue();
        iframe.width = width;
        iframe.height = height + 4;
      });
  }
}
