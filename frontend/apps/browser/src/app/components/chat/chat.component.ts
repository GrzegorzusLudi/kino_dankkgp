import {
  Component,
  DoCheck,
  inject,
  input,
  IterableDiffer,
  IterableDiffers,
  OnInit,
  signal,
} from '@angular/core';
import {
  FormControl,
  FormGroup,
  FormsModule,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';

import { ThemedDirective } from 'theme';
import { Message } from '../../models/message.interface';
import { ApiService } from '../../services/api/api.service';
import { ButtonComponent } from 'button';
import { HeaderComponent } from 'header';
import { InputComponent } from 'input';
import { TextComponent } from 'text';
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
  ],
  templateUrl: './chat.component.html',
  styleUrls: ['./chat.aero.component.scss', './chat.flat.component.scss'],
  hostDirectives: [ThemedDirective],
})
export class ChatComponent implements OnInit, DoCheck {
  username = input('');
  messages = input<Message[]>([]);

  protected readonly timestamps = signal<string[]>([]);
  protected form!: FormGroup;

  private readonly iterableDiffers = inject(IterableDiffers);
  private readonly apiService = inject(ApiService);
  private readonly toastService = inject(ToastService);

  private readonly differ: IterableDiffer<Message> = this.iterableDiffers
    .find([])
    .create<Message>();

  ngOnInit(): void {
    this.form = this.createChatForm(this.username());
  }

  ngDoCheck(): void {
    const changes = this.differ.diff(this.messages());

    if (changes) {
      this.timestamps.set(this.mapMessageTimestamps(this.messages()));
    }
  }

  trackByFn(index: number, message: Readonly<Message>): string {
    return `${index}:${message.date.valueOf()}:${message.username}:${message.text}`;
  }

  setUsername(): void {
    if (this.form.invalid) {
      this.toastService.next({
        title: 'Invalid username',
        message: 'Username cannot be empty.',
        variant: 'danger',
      });

      return;
    }

    this.apiService.setUsername(this.form.get('username')?.value ?? '');
    this.form.get('message')?.setValidators([Validators.required]);
    this.form.updateValueAndValidity();
  }

  sendMessage(): void {
    if (this.form.invalid) {
      this.toastService.next({
        title: 'Invalid message',
        message: 'Message cannot be empty.',
        variant: 'danger',
      });

      return;
    }

    this.apiService.sendMessage(this.form.get('message')?.value ?? '');
    this.form.get('message')?.setValue('');
    this.form.updateValueAndValidity();
  }

  private createChatForm(username: string): FormGroup {
    return username
      ? new FormGroup({
          message: new FormControl<string | null>('', {
            nonNullable: true,
            validators: [Validators.required],
          }),
          username: new FormControl<string | null>(username, {
            nonNullable: true,
            validators: [Validators.required],
          }),
        })
      : new FormGroup({
          message: new FormControl<string | null>(null, {
            nonNullable: false,
          }),
          username: new FormControl<string | null>('', {
            nonNullable: true,
            validators: [Validators.required],
          }),
        });
  }

  private mapMessageTimestamps(messages: Message[]): string[] {
    return messages.map(
      (message) =>
        `${message.date.getHours()}:${message.date.getMinutes()}:${message.date.getSeconds()}`,
    );
  }
}
