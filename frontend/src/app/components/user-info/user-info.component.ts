import { AsyncPipe, NgClass, NgIf } from '@angular/common';
import { Component, Input } from '@angular/core';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { faUser } from '@fortawesome/free-solid-svg-icons';

import { ThemedDirective } from '../../directives/themed/themed.directive';

@Component({
  selector: 'app-user-info',
  imports: [NgIf, NgClass, AsyncPipe, FontAwesomeModule],
  templateUrl: './user-info.component.html',
  styleUrls: [
    './user-info.light.component.scss',
    './user-info.dark.component.scss',
    './user-info.aero-light.component.scss',
    './user-info.aero-dark.component.scss',
  ],
})
export class UserInfoComponent extends ThemedDirective {
  @Input() username = '';

  faUser = faUser;
}
