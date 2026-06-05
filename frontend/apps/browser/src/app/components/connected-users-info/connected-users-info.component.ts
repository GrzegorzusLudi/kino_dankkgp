import { Component, input } from '@angular/core';

import { ThemedDirective } from 'theme';
import { HeaderComponent } from 'header';
import { TextComponent } from 'text';

@Component({
  selector: 'app-connected-users-info',
  imports: [HeaderComponent, TextComponent],
  hostDirectives: [ThemedDirective],
  templateUrl: './connected-users-info.component.html',
  styleUrls: [
    './connected-users-info.aero-dark.component.scss',
    './connected-users-info.aero-light.component.scss',
    './connected-users-info.dark.component.scss',
    './connected-users-info.light.component.scss',
  ],
})
export class ConnectedUsersInfoComponent {
  usernames = input<string[]>([]);

  trackByFn(index: number, username: string): string {
    return `${index}:${username}`;
  }
}
