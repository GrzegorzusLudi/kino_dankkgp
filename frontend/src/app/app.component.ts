import { AsyncPipe, NgIf } from '@angular/common';
import { AfterViewInit, Component, HostListener, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { Observable } from 'rxjs';

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
export class AppComponent
  extends ThemedDirective
  implements OnInit, AfterViewInit
{
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
  messages: Observable<Message[]>;
  username: Observable<string>;
  video = {
    id: 'dQw4w9WgXcQ',
    title: 'Test video title',
    width: INITIAL_VIDEO_WIDTH,
    height: INITIAL_VIDEO_HEIGHT,
  };

  constructor(
    protected override readonly themeService: ThemeService,
    private readonly apiService: ApiService,
    public dialog: MatDialog,
  ) {
    super(themeService);
    this.messages = this.apiService.messages;
    this.username = this.apiService.username;
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
    this.video.width = Math.max(
      MINIMUM_VIDEO_HEIGHT,
      Math.floor(dimensions.width),
    );
    this.video.height = Math.max(
      MINIMUM_VIDEO_HEIGHT,
      Math.floor(dimensions.height),
    );
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
