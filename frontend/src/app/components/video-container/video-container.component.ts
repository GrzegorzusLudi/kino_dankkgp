import { AsyncPipe, NgClass, NgIf } from '@angular/common';
import {
  Component,
  Input,
  OnChanges,
  OnDestroy,
  SimpleChanges,
} from '@angular/core';
import { get, isNull } from 'lodash';
import { YoutubePlayerComponent } from 'ngx-youtube-player';
import { BehaviorSubject, Subscription } from 'rxjs';

import { ThemedDirective } from '../../directives/themed/themed.directive';
import { ThemeService } from '../../services/theme/theme.service';
import { HeaderComponent } from '../header/header.component';
import {
  DEFAULT_VIDEO_HEIGHT,
  DEFAULT_VIDEO_WIDTH,
} from './video-container.consts';

@Component({
  selector: 'app-video-container',
  imports: [AsyncPipe, HeaderComponent, NgClass, NgIf, YoutubePlayerComponent],
  templateUrl: './video-container.component.html',
  styleUrls: [
    './video-container.aero-dark.component.scss',
    './video-container.aero-light.component.scss',
    './video-container.dark.component.scss',
    './video-container.light.component.scss',
  ],
})
export class VideoContainerComponent
  extends ThemedDirective
  implements OnChanges, OnDestroy
{
  @Input() title = '';
  @Input() videoId = '';
  @Input() width = DEFAULT_VIDEO_WIDTH;
  @Input() height = DEFAULT_VIDEO_HEIGHT;

  private player?: YT.Player;
  private readonly dimensions = new BehaviorSubject([
    `${DEFAULT_VIDEO_WIDTH}px`,
    `${DEFAULT_VIDEO_HEIGHT}px`,
  ]);
  private subscription?: Subscription;

  constructor(protected override readonly themeService: ThemeService) {
    super(themeService);
  }

  ngOnChanges(changes: SimpleChanges): void {
    const currentWidth = get(changes, 'width.currentValue', null);
    const currentHeight = get(changes, 'width.currentValue', null);

    if (!isNull(currentWidth) || !isNull(currentHeight)) {
      this.dimensions.next([`${this.width}px`, `${this.height}px`]);
    }
  }

  ngOnDestroy(): void {
    this.subscription?.unsubscribe();
  }

  savePlayer(player: Readonly<YT.Player>): void {
    this.player = player;

    this.subscription = this.dimensions.asObservable().subscribe(() => {
      this.updateIframeDimensions();
    });
  }

  private updateIframeDimensions(): void {
    const iframe = this.player?.getIframe();

    if (!iframe) {
      throw new Error('Video iframe is undefined');
    }

    const [width, height] = this.dimensions.getValue();
    iframe.width = width;
    iframe.height = height;
  }
}
