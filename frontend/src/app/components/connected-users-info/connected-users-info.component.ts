import { AsyncPipe, NgClass, NgFor, NgIf } from '@angular/common';
import { Component, Input } from '@angular/core';

import { ThemedDirective } from '../../directives/themed/themed.directive';
import { ThemeService } from '../../services/theme/theme.service';
import { HeaderComponent } from '../header/header.component';

@Component({
  selector: 'app-connected-users-info',
  imports: [AsyncPipe, HeaderComponent, NgClass, NgFor, NgIf],
  templateUrl: './connected-users-info.component.html',
  styleUrls: [
    './connected-users-info.aero-dark.component.scss',
    './connected-users-info.aero-light.component.scss',
    './connected-users-info.dark.component.scss',
    './connected-users-info.light.component.scss',
  ],
})
export class ConnectedUsersInfoComponent extends ThemedDirective {
  @Input() usernames: string[] = [];

  constructor(protected override readonly themeService: ThemeService) {
    super(themeService);
  }

  trackByFn(index: number, username: string): string {
    return `${index}:${username}`;
  }
}
