import { AsyncPipe, NgClass, NgFor, NgIf } from '@angular/common';
import { Component, Input } from '@angular/core';

import { ThemedDirective } from '../../directives/themed/themed.directive';

@Component({
  selector: 'app-connected-users-info',
  imports: [NgClass, NgIf, NgFor, AsyncPipe],
  templateUrl: './connected-users-info.component.html',
  styleUrls: [
    './connected-users-info.light.component.scss',
    './connected-users-info.dark.component.scss',
    './connected-users-info.aero-light.component.scss',
    './connected-users-info.aero-dark.component.scss',
  ],
})
export class ConnectedUsersInfoComponent extends ThemedDirective {
  @Input() usernames: string[] = [];
}
