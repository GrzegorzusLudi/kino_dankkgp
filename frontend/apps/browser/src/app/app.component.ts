import {
  AfterViewInit,
  Component,
  HostListener,
  inject,
  OnInit,
  Signal,
} from '@angular/core';
import { map } from 'rxjs';
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
import { ConnectedUsersInfoComponent } from './components/connected-users-info/connected-users-info.component';
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

@Component({
  selector: 'app-root',
  imports: [
    BackgroundComponent,
    ChatComponent,
    ConnectedUsersInfoComponent,
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
})
export class AppComponent implements OnInit, AfterViewInit {
  protected readonly theme = inject(THEME);

  title = 'Kino DANKKGP';
  usernames: Signal<string[]>;
  messages: Signal<Message[]>;
  username: Signal<string>;
  queue: Signal<Queue | undefined>;
  video: Signal<Video | undefined>;
  second: Signal<number | undefined>;

  protected width: number = INITIAL_VIDEO_WIDTH;
  protected height: number = INITIAL_VIDEO_HEIGHT;

  constructor(private readonly apiService: ApiService) {
    this.messages = toSignal(this.apiService.messages, { initialValue: [] });
    this.username = toSignal(this.apiService.username, { initialValue: '' });
    this.usernames = toSignal(this.apiService.usernames, { initialValue: [] });
    this.queue = toSignal(this.apiService.queue, { initialValue: undefined });
    this.video = toSignal(
      this.apiService.queue.pipe(
        map((queue) => {
          return queue?.currentlyPlayedVideo;
        }),
      ),
    );
    this.second = toSignal(
      this.apiService.queue.pipe(map((queue) => queue?.currentlyPlayedSecond)),
    );
  }

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
    this.width = Math.max(MINIMUM_VIDEO_WIDTH, Math.floor(dimensions.width));
    this.height = Math.floor(this.width * (9 / 16));
  }
}
