import {
  afterNextRender,
  ChangeDetectionStrategy,
  Component,
  inject,
  signal,
} from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { chain } from 'lodash-es';
import { map } from 'rxjs';

import { FooterComponent } from 'footer';
import { THEME } from 'theme';
import { TitleComponent } from 'title';
import { ToolbarComponent } from 'toolbar';
import { getOrZero } from 'utils';
import { VerticalSeparatorComponent } from 'vertical-separator';
import {
  APP_TITLE,
  HEIGHT_OFFSET,
  INITIAL_VIDEO_HEIGHT,
  INITIAL_VIDEO_WIDTH,
  MINIMUM_VIDEO_WIDTH,
  VIDEO_ASPECT_RATIO,
  WIDTH_OFFSET,
} from './app.consts';
import { BackgroundComponent } from './components/background/background.component';
import { ChatComponent } from './components/chat/chat.component';
import { ConnectedUsersComponent } from './components/connected-users/connected-users.component';
import { ModeToggleComponent } from './components/mode-toggle/mode-toggle.component';
import { QueueComponent } from './components/queue/queue.component';
import { ToastContainerComponent } from './components/toast-container/toast-container.component';
import { UserInfoComponent } from './components/user-info/user-info.component';
import { VideoActionsComponent } from './components/video-actions/video-actions.component';
import { VideoContainerComponent } from './components/video-container/video-container.component';
import { Dimensions } from './models/dimensions.interface';
import { ApiService } from './services/api/api.service';

@Component({
  selector: 'app-root',
  imports: [
    BackgroundComponent,
    ChatComponent,
    ConnectedUsersComponent,
    FooterComponent,
    ModeToggleComponent,
    QueueComponent,
    TitleComponent,
    ToastContainerComponent,
    ToolbarComponent,
    UserInfoComponent,
    VerticalSeparatorComponent,
    VideoActionsComponent,
    VideoContainerComponent,
  ],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss',
  host: {
    '(window:resize)': 'onResize($event)',
  },
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AppComponent {
  protected readonly title = APP_TITLE;

  protected readonly width = signal(INITIAL_VIDEO_WIDTH);
  protected readonly height = signal(INITIAL_VIDEO_HEIGHT);

  // Injected so that the theme custom properties are generated on bootstrap.
  private readonly theme = inject(THEME);
  private readonly apiService = inject(ApiService);

  protected readonly usernames = toSignal(this.apiService.usernames, {
    initialValue: [],
  });
  protected readonly messages = toSignal(this.apiService.messages, {
    initialValue: [],
  });
  protected readonly username = toSignal(this.apiService.username, {
    initialValue: '',
  });
  protected readonly queue = toSignal(this.apiService.queue, {
    initialValue: undefined,
  });
  protected readonly video = toSignal(
    this.apiService.queue.pipe(map((queue) => queue?.currentlyPlayedVideo)),
  );
  protected readonly second = toSignal(
    this.apiService.queue.pipe(map((queue) => queue?.currentlyPlayedSecond)),
  );

  constructor() {
    afterNextRender(() =>
      this.resizeVideoContainer(this.getDimensionsWithOffset(window)),
    );
  }

  protected onResize(event: Readonly<Event>): void {
    this.resizeVideoContainer(this.getDimensionsWithOffset(event.target));
  }

  private getDimensionsWithOffset(
    target: Window | EventTarget | null,
  ): Dimensions {
    return {
      width: getOrZero(target, 'innerWidth') - WIDTH_OFFSET,
      height: getOrZero(target, 'innerHeight') - HEIGHT_OFFSET,
    };
  }

  private resizeVideoContainer(dimensions: Readonly<Dimensions>): void {
    const { width, height } = chain(dimensions.width)
      .thru(Math.floor)
      .thru((value) => Math.max(MINIMUM_VIDEO_WIDTH, value))
      .thru((value) => ({
        width: value,
        height: Math.floor(value * VIDEO_ASPECT_RATIO),
      }))
      .value();

    this.width.set(width);
    this.height.set(height);
  }
}
