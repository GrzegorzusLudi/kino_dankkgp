import {
  Component,
  DoCheck,
  input,
  IterableDiffer,
  IterableDiffers,
  OnInit,
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
  styleUrls: [
    './chat.aero-dark.component.scss',
    './chat.aero-light.component.scss',
    './chat.dark.component.scss',
    './chat.light.component.scss',
  ],
  hostDirectives: [ThemedDirective],
})
export class ChatComponent implements OnInit, DoCheck {

  username = input('');
  messages = input<Message[]>([]);

  protected timestamps: string[] = [];
  protected form!: FormGroup;

  private readonly differ: IterableDiffer<Message>;

  constructor(
    private readonly iterableDiffers: IterableDiffers,
    private readonly apiService: ApiService,
    private readonly toastService: ToastService,
  ) {
    this.differ = this.iterableDiffers.find([]).create<Message>();
  }

  ngOnInit(): void {
    let message: FormControl<string | null>;
    let username: FormControl<string | null>;

    if (this.username()) {
      message = new FormControl<string | null>('', {
        nonNullable: true,
        validators: [Validators.required],
      });
      username = new FormControl<string | null>(this.username(), {
        nonNullable: true,
        validators: [Validators.required],
      });
    } else {
      message = new FormControl<string | null>(null, { nonNullable: false });
      username = new FormControl<string | null>('', {
        nonNullable: true,
        validators: [Validators.required],
      });
    }

    this.form = new FormGroup({
      message,
      username,
    });
  }

  ngDoCheck(): void {
    const changes = this.differ.diff(this.messages());

    if (changes) {
      this.timestamps = this.messages().map(
        (message: Readonly<Message>) =>
          `${message.date.getHours()}:${message.date.getMinutes()}:${message.date.getSeconds()}`,
      );
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
}
