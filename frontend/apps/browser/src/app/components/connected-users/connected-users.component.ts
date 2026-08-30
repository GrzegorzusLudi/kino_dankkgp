import { ChangeDetectionStrategy, Component, input } from '@angular/core';

import { HeaderComponent } from 'header';
import { TextComponent } from 'text';
import { ThemedDirective } from 'theme';

@Component({
  selector: 'app-connected-users',
  imports: [HeaderComponent, TextComponent],
  hostDirectives: [ThemedDirective],
  templateUrl: './connected-users.component.html',
  styleUrls: [
    './connected-users.aero.component.scss',
    './connected-users.flat.component.scss',
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ConnectedUsersComponent {
  readonly usernames = input<string[]>([]);

  protected trackByFn(index: number, username: string): string {
    return `${index}:${username}`;
  }
}
