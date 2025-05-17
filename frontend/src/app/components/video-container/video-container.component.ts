import { AsyncPipe, NgClass, NgIf } from '@angular/common';
import {
  Component,
  ElementRef,
  HostListener,
  Input,
  ViewChild,
} from '@angular/core';
import { YoutubePlayerComponent } from 'ngx-youtube-player';

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
export class VideoContainerComponent extends ThemedDirective {
  @Input() title = '';
  @Input() videoId = '';

  @ViewChild('container') container?: ElementRef;

  width = 0;
  height = 0;

  private player?: YT.Player;

  @HostListener('window:resize', ['$event'])
  onResize(event: Event) {
    const PADDING = 34;
    const RIGHT_CONTAINER_WIDTH = 344 + 24;
    const width = (event.target as Window).innerWidth - RIGHT_CONTAINER_WIDTH - PADDING || 0;

    this.handleResize(width);
  }

  savePlayer(player: YT.Player) {
    this.player = player;

    const PADDING = 34;
    this.handleResize(this.container?.nativeElement?.clientWidth - PADDING || 0);
  }

  onStateChange(event: unknown) {
    console.log('player state', event);
  }

  private handleResize(width: number) {
    if (!this.player) {
      return;
    }

    this.width = width;
    this.height = width * (9 / 16);

    const iframe = this.player.getIframe();
    iframe.width = this.width + 'px';
    iframe.height = this.height + 'px';
  }
}
