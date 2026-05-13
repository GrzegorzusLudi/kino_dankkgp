import { NgClass } from '@angular/common';
import { Component, inject, Input } from '@angular/core';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { faUser } from '@fortawesome/free-solid-svg-icons';

import { THEME } from 'theme';
import { MatDialog } from '@angular/material/dialog';
import { UsernameDialogComponent } from '../username-dialog/username-dialog.component';
import {
  USERNAME_DIALOG_ENTER_ANIMATION_DURATION,
  USERNAME_DIALOG_EXIT_ANIMATION_DURATION,
  USERNAME_DIALOG_HEIGHT,
  USERNAME_DIALOG_WIDTH,
} from '../username-dialog/username-dialog.consts';
import { ButtonComponent } from 'button';

@Component({
  selector: 'app-user-info',
  imports: [ButtonComponent, FontAwesomeModule, NgClass],
  templateUrl: './user-info.component.html',
  styleUrls: [
    './user-info.aero-dark.component.scss',
    './user-info.aero-light.component.scss',
    './user-info.dark.component.scss',
    './user-info.light.component.scss',
  ],
})
export class UserInfoComponent {
  protected readonly theme = inject(THEME);

  @Input() username = '';

  faUser = faUser;

  constructor(public dialog: MatDialog) {}

  openUsernameDialog(): void {
    this.dialog.open(UsernameDialogComponent, {
      width: USERNAME_DIALOG_WIDTH,
      height: USERNAME_DIALOG_HEIGHT,
      enterAnimationDuration: USERNAME_DIALOG_ENTER_ANIMATION_DURATION,
      exitAnimationDuration: USERNAME_DIALOG_EXIT_ANIMATION_DURATION,
    });
  }
}
