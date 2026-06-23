import { Component, input } from '@angular/core';

import { ThemedDirective } from 'theme';
import { HeaderComponent } from 'header';
import { TextComponent } from 'text';

@Component({
  selector: 'app-connected-users',
  imports: [HeaderComponent, TextComponent],
  hostDirectives: [ThemedDirective],
  templateUrl: './connected-users.component.html',
  styleUrls: [
    './connected-users.aero.component.scss',
    './connected-users.flat.component.scss',
  ],
})
export class ConnectedUsersComponent {
  usernames = input<string[]>([]);

  trackByFn(index: number, username: string): string {
    return `${index}:${username}`;
  }
}
