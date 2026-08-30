import {
  ChangeDetectionStrategy,
  Component,
  computed,
  inject,
  input,
} from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { faUser } from '@fortawesome/free-solid-svg-icons';

import { ButtonComponent } from 'button';
import { ThemedDirective } from 'theme';
import { GUEST_USERNAME } from './user-info.consts';
import { UsernameDialogComponent } from '../username-dialog/username-dialog.component';
import { USERNAME_DIALOG_CONFIG } from '../username-dialog/username-dialog.config';

@Component({
  selector: 'app-user-info',
  imports: [ButtonComponent, FontAwesomeModule],
  hostDirectives: [ThemedDirective],
  templateUrl: './user-info.component.html',
  styleUrls: [
    './user-info.aero.component.scss',
    './user-info.flat.component.scss',
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class UserInfoComponent {
  readonly username = input('');

  protected readonly faUser = faUser;

  protected readonly displayedUsername = computed(
    () => this.username() || GUEST_USERNAME,
  );

  private readonly dialog = inject(MatDialog);

  protected openUsernameDialog(): void {
    this.dialog.open(UsernameDialogComponent, USERNAME_DIALOG_CONFIG);
  }
}
