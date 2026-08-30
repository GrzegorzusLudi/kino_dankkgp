import {
  ChangeDetectionStrategy,
  Component,
  DestroyRef,
  effect,
  inject,
  input,
} from '@angular/core';
import { noop } from 'lodash-es';
import { BehaviorSubject, debounceTime, Subscription } from 'rxjs';
import { match, P } from 'ts-pattern';

import { TextComponent } from 'text';
import { ThemedDirective } from 'theme';
import { YouTubePlayer, YoutubePlayerComponent } from 'youtube-player';
import {
  DEFAULT_VIDEO_HEIGHT,
  DEFAULT_VIDEO_WIDTH,
  DIMENSIONS_CHANGE_DEBOUNCE_TIME,
  IFRAME_HEIGHT_OFFSET,
  IFRAME_UNDEFINED_ERROR,
  PLAYER_NOT_INITIALIZED_ERROR,
  SEEK_PRECISION_IN_SECONDS,
} from './video-container.consts';
import { Dimensions } from '../../models/dimensions.interface';

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
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class VideoContainerComponent {
  readonly title = input<string>();
  readonly videoId = input<string>();
  readonly second = input<number>();
  readonly width = input(DEFAULT_VIDEO_WIDTH);
  readonly height = input(DEFAULT_VIDEO_HEIGHT);

  private player?: YouTubePlayer;
  private subscription?: Subscription;

  private readonly dimensions = new BehaviorSubject<Dimensions>({
    width: DEFAULT_VIDEO_WIDTH,
    height: DEFAULT_VIDEO_HEIGHT,
  });

  private readonly destroyRef = inject(DestroyRef);

  constructor() {
    effect(() => {
      this.dimensions.next({ width: this.width(), height: this.height() });

      match(this.second())
        .with(nullish, noop)
        .otherwise((second) => this.seekTo(second));
    });

    this.destroyRef.onDestroy(() => this.subscription?.unsubscribe());
  }

  protected savePlayer(player: Readonly<YouTubePlayer>): void {
    this.player = player;

    this.subscription = this.dimensions
      .asObservable()
      .pipe(debounceTime(DIMENSIONS_CHANGE_DEBOUNCE_TIME))
      .subscribe(() => {
        this.updateIframeDimensions();
      });
  }

  private seekTo(seconds: number, allowSeekAhead = true): void {
    match(this.player)
      .with(nullish, () => {
        throw new Error(PLAYER_NOT_INITIALIZED_ERROR);
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
    precision = SEEK_PRECISION_IN_SECONDS,
  ): boolean {
    return (
      currentSeconds <= targetSeconds - precision ||
      currentSeconds >= targetSeconds + precision
    );
  }

  private updateIframeDimensions(): void {
    match(this.player?.getIframe())
      .with(nullish, () => {
        throw new Error(IFRAME_UNDEFINED_ERROR);
      })
      .otherwise((iframe) => {
        const { width, height } = this.dimensions.getValue();

        iframe.width = `${width}px`;
        iframe.height = `${height + IFRAME_HEIGHT_OFFSET}px`;
      });
  }
}
