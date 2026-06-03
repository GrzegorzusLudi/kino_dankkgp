import { NgClass } from '@angular/common';
import { Component, inject, input } from '@angular/core';

import { THEME } from 'theme';
import { HeaderComponent } from 'header';
import { TextComponent } from 'text';

@Component({
  selector: 'app-connected-users-info',
  imports: [HeaderComponent, NgClass, TextComponent],
  templateUrl: './connected-users-info.component.html',
  styleUrls: [
    './connected-users-info.aero-dark.component.scss',
    './connected-users-info.aero-light.component.scss',
    './connected-users-info.dark.component.scss',
    './connected-users-info.light.component.scss',
  ],
})
export class ConnectedUsersInfoComponent {
  protected readonly theme = inject(THEME);

  usernames = input<string[]>([]);

  trackByFn(index: number, username: string): string {
    return `${index}:${username}`;
  }
}
