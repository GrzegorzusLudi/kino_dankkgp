import { AsyncPipe, NgIf } from '@angular/common';
import { AfterViewInit, Component, HostListener } from '@angular/core';

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
import { Message } from './models/message.interface';

@Component({
  selector: 'app-root',
  imports: [
    AsyncPipe,
    BackgroundComponent,
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
  videoWidth = 0;
  videoHeight = 0;

  private readonly widthOffset = 402;
  private readonly heightOffset = 234;

  @HostListener('window:resize', ['$event'])
  onResize(event: Event) {
    const width = ((event.target as Window).innerWidth || 0) - this.widthOffset;
    const height =
      ((event.target as Window).innerHeight || 0) - this.heightOffset;

    this.resizeVideoContainer(width < 0 ? 0 : width, height < 0 ? 0 : height);
  }

  ngAfterViewInit(): void {
      const width = ((window as Window).innerWidth || 0) - this.widthOffset;
      const height = ((window as Window).innerHeight || 0) - this.heightOffset;

      this.resizeVideoContainer(width < 0 ? 0 : width, height < 0 ? 0 : height);
  }

  private resizeVideoContainer(width: number, height: number): void {
    this.videoWidth = Math.floor(width);
    this.videoHeight = Math.floor(height);
  }
}
