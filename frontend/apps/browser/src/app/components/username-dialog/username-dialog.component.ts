import { Component, OnInit } from '@angular/core';
import { FormControl, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatDialogRef } from '@angular/material/dialog';
import { take } from 'rxjs';

import { ThemedDirective } from 'theme';
import { ApiService } from '../../services/api/api.service';
import { ButtonComponent } from 'button';
import { HeaderComponent } from 'header';
import { InputComponent } from 'input';

@Component({
  selector: 'app-username-dialog',
  imports: [
    ButtonComponent,
    FormsModule,
    HeaderComponent,
    InputComponent,
    ReactiveFormsModule,
  ],
  hostDirectives: [ThemedDirective],
  templateUrl: './username-dialog.component.html',
  styleUrls: [
    './username-dialog.aero.component.scss',
    './username-dialog.flat.component.scss',
  ],
})
export class UsernameDialogComponent implements OnInit {
  username = new FormControl<string>('');

  constructor(
    private readonly apiService: ApiService,
    private readonly dialogRef: MatDialogRef<UsernameDialogComponent>,
  ) {}

  ngOnInit(): void {
    this.apiService.username.pipe(take(1)).subscribe((name) => {
      this.username.setValue(name);
    });
  }

  setUsername(): void {
    if (this.username.value) {
      this.apiService.setUsername(this.username.value);
      this.dialogRef.close();
    }
  }
}
