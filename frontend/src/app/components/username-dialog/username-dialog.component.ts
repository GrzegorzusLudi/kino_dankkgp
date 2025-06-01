import { AsyncPipe, NgClass, NgIf } from '@angular/common';
import { Component } from '@angular/core';
import { FormControl, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatDialogRef } from '@angular/material/dialog';

import { ThemedDirective } from '../../directives/themed/themed.directive';
import { ApiService } from '../../services/api/api.service';
import { ThemeService } from '../../services/theme/theme.service';
import { ButtonComponent } from '../button/button.component';
import { HeaderComponent } from '../header/header.component';
import { InputComponent } from '../input/input.component';

@Component({
  selector: 'app-username-dialog',
  imports: [
    AsyncPipe,
    ButtonComponent,
    FormsModule,
    HeaderComponent,
    InputComponent,
    NgClass,
    NgIf,
    ReactiveFormsModule,
  ],
  templateUrl: './username-dialog.component.html',
  styleUrls: [
    './username-dialog.aero-dark.component.scss',
    './username-dialog.aero-light.component.scss',
    './username-dialog.dark.component.scss',
    './username-dialog.light.component.scss',
  ],
})
export class UsernameDialogComponent extends ThemedDirective {
  username = new FormControl<string>('');

  constructor(
    protected override readonly themeService: ThemeService,
    private readonly apiService: ApiService,
    private readonly dialogRef: MatDialogRef<UsernameDialogComponent>,
  ) {
    super(themeService);
  }

  setUsername(): void {
    // eslint-disable-next-line @typescript-eslint/strict-boolean-expressions
    if (this.username.value) {
      this.apiService.setUsername(this.username.value);
      this.dialogRef.close();
    }
  }
}
