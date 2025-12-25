import { NgClass } from '@angular/common';
import { Component, Input } from '@angular/core';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { faUser } from '@fortawesome/free-solid-svg-icons';

import { ThemedDirective } from '../../directives/themed/themed.directive';
import { ThemeService } from '../../services/theme/theme.service';
import { RoundButtonComponent } from '../round-button/round-button.component';
import { MatDialog } from '@angular/material/dialog';
import { UsernameDialogComponent } from '../username-dialog/username-dialog.component';
import {
  USERNAME_DIALOG_ENTER_ANIMATION_DURATION,
  USERNAME_DIALOG_EXIT_ANIMATION_DURATION,
  USERNAME_DIALOG_HEIGHT,
  USERNAME_DIALOG_WIDTH,
} from '../username-dialog/username-dialog.consts';

@Component({
  selector: 'app-user-info',
  imports: [FontAwesomeModule, NgClass, RoundButtonComponent],
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

  constructor(
    protected override readonly themeService: ThemeService,
    public dialog: MatDialog,
  ) {
    super(themeService);
  }

  openUsernameDialog(): void {
    this.dialog.open(UsernameDialogComponent, {
      width: USERNAME_DIALOG_WIDTH,
      height: USERNAME_DIALOG_HEIGHT,
      enterAnimationDuration: USERNAME_DIALOG_ENTER_ANIMATION_DURATION,
      exitAnimationDuration: USERNAME_DIALOG_EXIT_ANIMATION_DURATION,
    });
  }
}
