import { AsyncPipe, NgIf } from '@angular/common';
import { AfterViewInit, Component, HostListener } from '@angular/core';

import {
  HEIGHT_OFFSET,
  INITIAL_VIDEO_HEIGHT,
  INITIAL_VIDEO_WIDTH,
  MINIMUM_VIDEO_HEIGHT,
  WIDTH_OFFSET,
} from './app.consts';
import { BackgroundComponent } from './components/background/background.component';
import { ChatComponent } from './components/chat/chat.component';
import { ConnectedUsersInfoComponent } from './components/connected-users-info/connected-users-info.component';
import { ModeToggleComponent } from './components/mode-toggle/mode-toggle.component';
import { TitleComponent } from './components/title/title.component';
import { ToolbarComponent } from './components/toolbar/toolbar.component';
import { UserInfoComponent } from './components/user-info/user-info.component';
import { VerticalSeparatorComponent } from './components/vertical-separator/vertical-separator.component';
import { VideoActionsComponent } from './components/video-actions/video-actions.component';
import { VideoContainerComponent } from './components/video-container/video-container.component';
import { ThemedDirective } from './directives/themed/themed.directive';
import { getOrZero } from './functions/get-or-zero.function';
import { Message } from './models/message.interface';
import { ThemeService } from './services/theme/theme.service';

interface Dimensions {
  width: number;
  height: number;
}

@Component({
  selector: 'app-root',
  imports: [
    AsyncPipe,
    BackgroundComponent,
    ChatComponent,
    ConnectedUsersInfoComponent,
    ModeToggleComponent,
    NgIf,
    TitleComponent,
    ToolbarComponent,
    UserInfoComponent,
    VerticalSeparatorComponent,
    VideoActionsComponent,
    VideoContainerComponent,
  ],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss',
})
export class AppComponent extends ThemedDirective implements AfterViewInit {
  title = 'Kino DANKKGP';
  usernames = [
    'Adam',
    'Celina',
    'John',
    'Bertha',
    'Robert',
    'Anna',
    'Łukasz',
    'Przemek',
    'Grzesiek',
    'Kazik',
  ];
  messages: Message[] = [
    {
      date: new Date(),
      username: 'Adam',
      text: 'Hello World',
    },
  ];
  video = {
    title: 'Test video title',
  };
  videoWidth = INITIAL_VIDEO_WIDTH;
  videoHeight = INITIAL_VIDEO_HEIGHT;

  constructor(protected override readonly themeService: ThemeService) {
    super(themeService);
  }

  @HostListener('window:resize', ['$event'])
  onResize(event: Event): void {
    this.resizeVideoContainer(this.getDimensionsWithOffset(event.target));
  }

  ngAfterViewInit(): void {
    this.resizeVideoContainer(this.getDimensionsWithOffset(window));
  }

  private getDimensionsWithOffset(
    target: Window | EventTarget | null,
  ): Dimensions {
    return {
      width: getOrZero(target, 'innerWidth') - WIDTH_OFFSET,
      height: getOrZero(target, 'innerHeight') - HEIGHT_OFFSET,
    };
  }

  private resizeVideoContainer(dimensions: Dimensions): void {
    this.videoWidth = Math.max(
      MINIMUM_VIDEO_HEIGHT,
      Math.floor(dimensions.width),
    );
    this.videoHeight = Math.max(
      MINIMUM_VIDEO_HEIGHT,
      Math.floor(dimensions.height),
    );
  }
}
