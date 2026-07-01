import { Component, inject, input } from '@angular/core';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { faUser } from '@fortawesome/free-solid-svg-icons';

import { ThemedDirective } from 'theme';
import { MatDialog } from '@angular/material/dialog';
import { UsernameDialogComponent } from '../username-dialog/username-dialog.component';
import { USERNAME_DIALOG_CONFIG } from '../username-dialog/username-dialog.config';
import { ButtonComponent } from 'button';

@Component({
  selector: 'app-user-info',
  imports: [ButtonComponent, FontAwesomeModule],
  hostDirectives: [ThemedDirective],
  templateUrl: './user-info.component.html',
  styleUrls: [
    './user-info.aero.component.scss',
    './user-info.flat.component.scss',
  ],
})
export class UserInfoComponent {
  username = input('');

  faUser = faUser;

  private readonly dialog = inject(MatDialog);

  openUsernameDialog(): void {
    this.dialog.open(UsernameDialogComponent, USERNAME_DIALOG_CONFIG);
  }
}
