import { AsyncPipe, NgClass, NgIf } from '@angular/common';
import {
  Component,
  Input,
  OnChanges,
  OnDestroy,
  SimpleChanges,
} from '@angular/core';
import { YoutubePlayerComponent } from 'ngx-youtube-player';
import { BehaviorSubject, Subscription } from 'rxjs';

import { ThemedDirective } from '../../directives/themed/themed.directive';
import { HeaderComponent } from '../header/header.component';

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
  @Input() width = 0;
  @Input() height = 0;

  private player?: YT.Player;
  private dimensions = new BehaviorSubject(['0px', '0px']);
  private subscription?: Subscription;

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['width'].currentValue || changes['height'].currentValue) {
      this.dimensions.next([this.width + 'px', this.height + 'px']);
    }
  }

  ngOnDestroy(): void {
    this.subscription?.unsubscribe();
  }

  savePlayer(player: YT.Player) {
    this.player = player;

    this.subscription = this.dimensions.asObservable().subscribe(() => {
      this.updateIframeDimensions();
    });
  }

  onStateChange(event: unknown) {
    console.log('player state', event);
  }

  private updateIframeDimensions(): void {
    const iframe = this.player?.getIframe();

    if (!iframe) {
      throw new Error('Video iframe is undefined');
    }

    iframe.width = this.dimensions.getValue()[0];
    iframe.height = this.dimensions.getValue()[1];
  }
}
