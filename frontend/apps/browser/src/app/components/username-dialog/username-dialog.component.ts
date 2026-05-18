import { NgClass } from '@angular/common';
import { Component, inject } from '@angular/core';
import { FormControl, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatDialogRef } from '@angular/material/dialog';

import { THEME } from 'theme';
import { ApiService } from '../../services/api/api.service';
import { ButtonComponent } from 'button';
import { HeaderComponent } from 'header';
import { InputComponent } from '../input/input.component';

@Component({
  selector: 'app-username-dialog',
  imports: [
    ButtonComponent,
    FormsModule,
    HeaderComponent,
    InputComponent,
    NgClass,
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
export class UsernameDialogComponent {
  protected readonly theme = inject(THEME);

  username = new FormControl<string>('');

  constructor(
    private readonly apiService: ApiService,
    private readonly dialogRef: MatDialogRef<UsernameDialogComponent>,
  ) {}

  setUsername(): void {
    if (this.username.value) {
      this.apiService.setUsername(this.username.value);
      this.dialogRef.close();
    }
  }
}
