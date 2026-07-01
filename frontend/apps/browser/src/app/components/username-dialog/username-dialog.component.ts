import { Component, inject, OnInit } from '@angular/core';
import { FormControl, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatDialogRef } from '@angular/material/dialog';
import { take } from 'rxjs';
import { match, P } from 'ts-pattern';
import { noop } from 'lodash-es';

import { ThemedDirective } from 'theme';
import { ApiService } from '../../services/api/api.service';
import { ButtonComponent } from 'button';
import { HeaderComponent } from 'header';
import { InputComponent } from 'input';

const { nullish, union } = P;

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

  private readonly apiService = inject(ApiService);
  private readonly dialogRef = inject(MatDialogRef<UsernameDialogComponent>);

  ngOnInit(): void {
    this.apiService.username.pipe(take(1)).subscribe((name) => {
      this.username.setValue(name);
    });
  }

  setUsername(): void {
    match(this.username.value)
      .with(union(nullish, ''), noop)
      .otherwise((value) => {
        this.apiService.setUsername(value);
        this.dialogRef.close();
      });
  }
}
