import {
  ChangeDetectionStrategy,
  Component,
  computed,
  inject,
  input,
} from '@angular/core';
import {
  FormControl,
  FormGroup,
  FormsModule,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { match } from 'ts-pattern';

import { ButtonComponent } from 'button';
import { HeaderComponent } from 'header';
import { InputComponent } from 'input';
import { TextComponent } from 'text';
import { ThemedDirective } from 'theme';
import { ChatFormControls } from './chat-form-controls.interface';
import {
  INVALID_MESSAGE_TOAST_MESSAGE,
  INVALID_MESSAGE_TOAST_TITLE,
  INVALID_USERNAME_TOAST_MESSAGE,
  INVALID_USERNAME_TOAST_TITLE,
  MESSAGE_CONTROL_NAME,
  USERNAME_CONTROL_NAME,
} from './chat.consts';
import { Message } from '../../models/message.interface';
import { TimestampPipe } from '../../pipes/timestamp/timestamp.pipe';
import { ApiService } from '../../services/api/api.service';
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
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ChatComponent {
  readonly username = input('');
  readonly messages = input<Message[]>([]);

  protected readonly form = computed(() =>
    this.createFormGroup(this.username()),
  );

  private readonly apiService = inject(ApiService);
  private readonly toastService = inject(ToastService);

  protected trackByFn(index: number, message: Readonly<Message>): string {
    return `${index}:${message.date.valueOf()}:${message.username}:${message.text}`;
  }

  protected setUsername(): void {
    const form = this.form();

    match(form.invalid)
      .with(true, () =>
        this.toastService.next({
          title: INVALID_USERNAME_TOAST_TITLE,
          message: INVALID_USERNAME_TOAST_MESSAGE,
          variant: 'danger',
        }),
      )
      .otherwise(() => {
        this.apiService.setUsername(
          form.get(USERNAME_CONTROL_NAME)?.value ?? '',
        );
        form.get(MESSAGE_CONTROL_NAME)?.setValidators([Validators.required]);
        form.updateValueAndValidity();
      });
  }

  protected sendMessage(): void {
    const form = this.form();

    match(form.invalid)
      .with(true, () =>
        this.toastService.next({
          title: INVALID_MESSAGE_TOAST_TITLE,
          message: INVALID_MESSAGE_TOAST_MESSAGE,
          variant: 'danger',
        }),
      )
      .otherwise(() => {
        this.apiService.sendMessage(
          form.get(MESSAGE_CONTROL_NAME)?.value ?? '',
        );
        form.get(MESSAGE_CONTROL_NAME)?.setValue('');
        form.updateValueAndValidity();
      });
  }

  private createFormGroup(username: string): FormGroup<ChatFormControls> {
    return new FormGroup<ChatFormControls>(
      match(username)
        .with('', () => this.createEmptyUsernameFormControls())
        .otherwise((value) => this.createNonEmptyUsernameFormControls(value)),
    );
  }

  private createEmptyUsernameFormControls(): ChatFormControls {
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

  private createNonEmptyUsernameFormControls(
    username: string,
  ): ChatFormControls {
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
