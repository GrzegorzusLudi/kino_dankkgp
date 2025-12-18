import { AsyncPipe, NgIf } from '@angular/common';
import { AfterViewInit, Component, HostListener, OnInit, Signal, signal } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { map, Observable } from 'rxjs';
import { toSignal } from '@angular/core/rxjs-interop';
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
import { UsernameDialogComponent } from './components/username-dialog/username-dialog.component';
import {
  USERNAME_DIALOG_ENTER_ANIMATION_DURATION,
  USERNAME_DIALOG_EXIT_ANIMATION_DURATION,
  USERNAME_DIALOG_HEIGHT,
  USERNAME_DIALOG_WIDTH,
} from './components/username-dialog/username-dialog.consts';
import { VerticalSeparatorComponent } from './components/vertical-separator/vertical-separator.component';
import { VideoActionsComponent } from './components/video-actions/video-actions.component';
import { VideoContainerComponent } from './components/video-container/video-container.component';
import { ThemedDirective } from './directives/themed/themed.directive';
import { getOrZero } from './functions/get-or-zero.function';
import { Dimensions } from './models/dimensions.interface';
import { Message } from './models/message.interface';
import { ApiService } from './services/api/api.service';
import { ThemeService } from './services/theme/theme.service';
import { Queue } from './models/queue.interface';
import { Video } from './models/video.interface';
import { ToastComponent } from './components/toast/toast.component';

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
    ToastComponent,
    ToolbarComponent,
    UserInfoComponent,
    VerticalSeparatorComponent,
    VideoActionsComponent,
    VideoContainerComponent,
  ],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss',
})
export class AppComponent
  extends ThemedDirective
  implements OnInit, AfterViewInit {
  title = 'Kino DANKKGP';
  usernames: Observable<string[]>;
  messages: Observable<Message[]>;
  username: Observable<string>;
  queue: Observable<Queue | undefined>;
  video: Signal<Video | undefined>;

  protected width: number = INITIAL_VIDEO_WIDTH;
  protected height: number = INITIAL_VIDEO_HEIGHT;

  constructor(
    protected override readonly themeService: ThemeService,
    private readonly apiService: ApiService,
    public dialog: MatDialog,
  ) {
    super(themeService);
    this.messages = this.apiService.messages;
    this.username = this.apiService.username;
    this.usernames = this.apiService.usernames;
    this.queue = this.apiService.queue;
    this.video = toSignal(this.apiService.queue.pipe(
      map((queue) => {
        return queue?.currentlyPlayedVideo;
      }),
    ));
  }

  ngOnInit(): void {
    this.openUsernameDialog();
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
    this.width = Math.max(MINIMUM_VIDEO_HEIGHT, Math.floor(dimensions.width));
    this.height = Math.max(MINIMUM_VIDEO_HEIGHT, Math.floor(dimensions.height));
  }

  private openUsernameDialog(): void {
    this.dialog.open(UsernameDialogComponent, {
      width: USERNAME_DIALOG_WIDTH,
      height: USERNAME_DIALOG_HEIGHT,
      enterAnimationDuration: USERNAME_DIALOG_ENTER_ANIMATION_DURATION,
      exitAnimationDuration: USERNAME_DIALOG_EXIT_ANIMATION_DURATION,
    });
  }
}
