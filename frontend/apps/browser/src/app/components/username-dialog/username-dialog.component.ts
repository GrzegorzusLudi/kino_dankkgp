import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { FormControl, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatDialogRef } from '@angular/material/dialog';
import { noop } from 'lodash-es';
import { take } from 'rxjs';
import { match, P } from 'ts-pattern';

import { ButtonComponent } from 'button';
import { HeaderComponent } from 'header';
import { InputComponent } from 'input';
import { ThemedDirective } from 'theme';
import { ApiService } from '../../services/api/api.service';

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
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class UsernameDialogComponent {
  protected readonly username = new FormControl<string>('');

  private readonly apiService = inject(ApiService);
  private readonly dialogRef = inject(MatDialogRef<UsernameDialogComponent>);

  constructor() {
    this.apiService.username
      .pipe(take(1), takeUntilDestroyed())
      .subscribe((name) => this.username.setValue(name));
  }

  protected setUsername(): void {
    match(this.username.value)
      .with(union(nullish, ''), noop)
      .otherwise((value) => {
        this.apiService.setUsername(value);
        this.dialogRef.close();
      });
  }
}
