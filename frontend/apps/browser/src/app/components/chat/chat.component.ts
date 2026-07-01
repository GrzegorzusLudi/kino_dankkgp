import { Component, effect, inject, input } from '@angular/core';
import {
  FormControl,
  FormGroup,
  FormsModule,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { match } from 'ts-pattern';
import { chain } from 'lodash-es';

import { ThemedDirective } from 'theme';
import { Message } from '../../models/message.interface';
import { ApiService } from '../../services/api/api.service';
import { ButtonComponent } from 'button';
import { HeaderComponent } from 'header';
import { InputComponent } from 'input';
import { TextComponent } from 'text';
import { TimestampPipe } from '../../pipes/timestamp/timestamp.pipe';
import { ToastService } from '../../services/toast/toast.service';

@Component({
  selector: 'app-chat',
  imports: [
    ButtonComponent,
    FormsModule,
    HeaderComponent,
    InputComponent,
    ReactiveFormsModule,
    TextComponent,
    TimestampPipe,
  ],
  templateUrl: './chat.component.html',
  styleUrls: ['./chat.aero.component.scss', './chat.flat.component.scss'],
  hostDirectives: [ThemedDirective],
})
export class ChatComponent {
  readonly username = input('');
  readonly messages = input<Message[]>([]);

  protected form!: FormGroup;

  private readonly apiService = inject(ApiService);
  private readonly toastService = inject(ToastService);

  constructor() {
    effect(() => {
      this.form = this.createFormGroup(this.username());
    });
  }

  trackByFn(index: number, message: Readonly<Message>): string {
    return `${index}:${message.date.valueOf()}:${message.username}:${message.text}`;
  }

  setUsername(): void {
    match(this.form.invalid)
      .with(true, () =>
        this.toastService.next({
          title: 'Invalid username',
          message: 'Username cannot be empty.',
          variant: 'danger',
        }),
      )
      .otherwise(() => {
        this.apiService.setUsername(this.form.get('username')?.value ?? '');
        this.form.get('message')?.setValidators([Validators.required]);
        this.form.updateValueAndValidity();
      });
  }

  sendMessage(): void {
    match(this.form.invalid)
      .with(true, () =>
        this.toastService.next({
          title: 'Invalid message',
          message: 'Message cannot be empty.',
          variant: 'danger',
        }),
      )
      .otherwise(() => {
        this.apiService.sendMessage(this.form.get('message')?.value ?? '');
        this.form.get('message')?.setValue('');
        this.form.updateValueAndValidity();
      });
  }

  private createFormGroup(username: string): FormGroup {
    return chain(username)
      .thru((username) => (
        match(username)
          .with('', () => this.createEmptyUsernameFormControls())
          .otherwise((username) => this.createNonEmptyUsernameFormControls(username))
      ))
      .thru((controls) => new FormGroup(controls))
      .value();
  }

  private createEmptyUsernameFormControls(): {
    message: FormControl<string | null>;
    username: FormControl<string | null>;
  } {
    return {
      message: new FormControl<string | null>(null, {
        nonNullable: false,
      }),
      username: new FormControl<string | null>('', {
        nonNullable: true,
        validators: [Validators.required],
      }),
    };
  }

  private createNonEmptyUsernameFormControls(username: string): {
    message: FormControl<string | null>;
    username: FormControl<string | null>;
  } {
    return {
      message: new FormControl<string | null>('', {
        nonNullable: true,
        validators: [Validators.required],
      }),
      username: new FormControl<string | null>(username, {
        nonNullable: true,
        validators: [Validators.required],
      }),
    };
  }
}
