import { AsyncPipe, NgIf } from '@angular/common';
import { Component } from '@angular/core';

import { BackgroundComponent } from './components/background/background.component';
import { ButtonComponent } from './components/button/button.component';
import { ChatComponent } from './components/chat/chat.component';
import { ConnectedUsersInfoComponent } from './components/connected-users-info/connected-users-info.component';
import { ModeToggleComponent } from './components/mode-toggle/mode-toggle.component';
import { TitleComponent } from './components/title/title.component';
import { ToolbarComponent } from './components/toolbar/toolbar.component';
import { UserInfoComponent } from './components/user-info/user-info.component';
import { VerticalSeparatorComponent } from './components/vertical-separator/vertical-separator.component';
import { ThemedDirective } from './directives/themed/themed.directive';
import { Message } from './models/message.interface';

@Component({
  selector: 'app-root',
  imports: [
    BackgroundComponent,
    ButtonComponent,
    ToolbarComponent,
    BackgroundComponent,
    NgIf,
    AsyncPipe,
    TitleComponent,
    ModeToggleComponent,
    UserInfoComponent,
    VerticalSeparatorComponent,
    ConnectedUsersInfoComponent,
    ChatComponent,
  ],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss',
})
export class AppComponent extends ThemedDirective {
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
}
