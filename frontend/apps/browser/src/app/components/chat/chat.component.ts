import { NgClass } from '@angular/common';
import {
  Component,
  DoCheck,
  Input,
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

import { ThemedDirective } from '../../directives/themed/themed.directive';
import { Message } from '../../models/message.interface';
import { ApiService } from '../../services/api/api.service';
import { ThemeService } from 'theme';
import { ButtonComponent } from '../button/button.component';
import { HeaderComponent } from '../header/header.component';
import { InputComponent } from '../input/input.component';
import { ToastService } from '../../services/toast/toast.service';

@Component({
  selector: 'app-chat',
  imports: [
    ButtonComponent,
    FormsModule,
    HeaderComponent,
    InputComponent,
    NgClass,
    ReactiveFormsModule,
  ],
  templateUrl: './chat.component.html',
  styleUrls: [
    './chat.aero-dark.component.scss',
    './chat.aero-light.component.scss',
    './chat.dark.component.scss',
    './chat.light.component.scss',
  ],
})
export class ChatComponent extends ThemedDirective implements OnInit, DoCheck {
  @Input() username: string = '';
  @Input() messages: Message[] = [];

  protected timestamps: string[] = [];
  protected form!: FormGroup;

  private readonly differ: IterableDiffer<Message>;

  constructor(
    protected override readonly themeService: ThemeService,
    private readonly iterableDiffers: IterableDiffers,
    private readonly apiService: ApiService,
    private readonly toastService: ToastService,
  ) {
    super(themeService);
    this.differ = this.iterableDiffers.find([]).create<Message>();
  }

  ngOnInit(): void {
    let message: FormControl<string | null>;
    let username: FormControl<string | null>;

    if (this.username) {
      message = new FormControl<string | null>('', {
        nonNullable: true,
        validators: [Validators.required],
      });
      username = new FormControl<string | null>(this.username, {
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
    const changes = this.differ.diff(this.messages);

    if (changes) {
      this.timestamps = this.messages.map(
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
