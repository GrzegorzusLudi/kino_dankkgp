import { AsyncPipe, NgClass, NgIf } from '@angular/common';
import { Component, Input } from '@angular/core';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { faUser } from '@fortawesome/free-solid-svg-icons';

import { ThemedDirective } from '../../directives/themed/themed.directive';
import { ThemeService } from '../../services/theme/theme.service';
import { RoundButtonComponent } from '../round-button/round-button.component';

@Component({
  selector: 'app-user-info',
  imports: [AsyncPipe, FontAwesomeModule, NgClass, NgIf, RoundButtonComponent],
  templateUrl: './user-info.component.html',
  styleUrls: [
    './user-info.aero-dark.component.scss',
    './user-info.aero-light.component.scss',
    './user-info.dark.component.scss',
    './user-info.light.component.scss',
  ],
})
export class UserInfoComponent extends ThemedDirective {
  @Input() username = '';

  faUser = faUser;

  constructor(protected override readonly themeService: ThemeService) {
    super(themeService);
  }
}
