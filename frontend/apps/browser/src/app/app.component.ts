import {
  AfterViewInit,
  Component,
  HostListener,
  inject,
  OnInit,
  Signal,
  signal,
} from '@angular/core';
import { map } from 'rxjs';
import { chain } from 'lodash-es';
import { toSignal } from '@angular/core/rxjs-interop';
import {
  HEIGHT_OFFSET,
  INITIAL_VIDEO_HEIGHT,
  INITIAL_VIDEO_WIDTH,
  MINIMUM_VIDEO_WIDTH,
  WIDTH_OFFSET,
} from './app.consts';
import { BackgroundComponent } from './components/background/background.component';
import { ChatComponent } from './components/chat/chat.component';
import { ConnectedUsersComponent } from './components/connected-users/connected-users.component';
import { ModeToggleComponent } from './components/mode-toggle/mode-toggle.component';
import { TitleComponent } from 'title';
import { ToolbarComponent } from 'toolbar';
import { UserInfoComponent } from './components/user-info/user-info.component';
import { VerticalSeparatorComponent } from 'vertical-separator';
import { VideoActionsComponent } from './components/video-actions/video-actions.component';
import { VideoContainerComponent } from './components/video-container/video-container.component';
import { THEME } from 'theme';
import { getOrZero } from 'utils';
import { Dimensions } from './models/dimensions.interface';
import { Message } from './models/message.interface';
import { ApiService } from './services/api/api.service';
import { Queue } from './models/queue.interface';
import { Video } from './models/video.interface';
import { ToastContainerComponent } from './components/toast-container/toast-container.component';
import { QueueComponent } from './components/queue/queue.component';
import { TextComponent } from 'text';

@Component({
  selector: 'app-root',
  imports: [
    BackgroundComponent,
    ChatComponent,
    ConnectedUsersComponent,
    ModeToggleComponent,
    QueueComponent,
    TitleComponent,
    ToastContainerComponent,
    ToolbarComponent,
    UserInfoComponent,
    VerticalSeparatorComponent,
    VideoActionsComponent,
    VideoContainerComponent,
    TextComponent,
  ],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss',
})
export class AppComponent implements OnInit, AfterViewInit {
  protected readonly theme = inject(THEME);

  private readonly apiService = inject(ApiService);

  title = 'Kino DANKKGP';

  usernames: Signal<string[]> = toSignal(this.apiService.usernames, {
    initialValue: [],
  });
  messages: Signal<Message[]> = toSignal(this.apiService.messages, {
    initialValue: [],
  });
  username: Signal<string> = toSignal(this.apiService.username, {
    initialValue: '',
  });
  queue: Signal<Queue | undefined> = toSignal(this.apiService.queue, {
    initialValue: undefined,
  });
  video: Signal<Video | undefined> = toSignal(
    this.apiService.queue.pipe(map((queue) => queue?.currentlyPlayedVideo)),
  );
  second: Signal<number | undefined> = toSignal(
    this.apiService.queue.pipe(map((queue) => queue?.currentlyPlayedSecond)),
  );

  protected readonly width = signal(INITIAL_VIDEO_WIDTH);
  protected readonly height = signal(INITIAL_VIDEO_HEIGHT);

  ngOnInit(): void {}

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
    const { width, height } = chain(dimensions.width)
      .thru(Math.floor)
      .thru((value) => Math.max(MINIMUM_VIDEO_WIDTH, value))
      .thru((width) => ({ width, height: Math.floor(width * (9 / 16)) }))
      .value();

    this.width.set(width);
    this.height.set(height);
  }
}
