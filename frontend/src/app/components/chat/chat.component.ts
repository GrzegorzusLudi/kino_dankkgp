import { AsyncPipe, NgClass, NgFor, NgIf } from '@angular/common';
import {
  Component,
  DoCheck,
  Input,
  IterableDiffer,
  IterableDiffers,
} from '@angular/core';

import { ThemedDirective } from '../../directives/themed/themed.directive';
import { Message } from '../../models/message.interface';
import { ThemeService } from '../../services/theme/theme.service';
import { ButtonComponent } from '../button/button.component';
import { HeaderComponent } from '../header/header.component';
import { InputComponent } from '../input/input.component';

@Component({
  selector: 'app-chat',
  imports: [
    AsyncPipe,
    ButtonComponent,
    HeaderComponent,
    InputComponent,
    NgClass,
    NgFor,
    NgIf,
  ],
  templateUrl: './chat.component.html',
  styleUrls: [
    './chat.aero-dark.component.scss',
    './chat.aero-light.component.scss',
    './chat.dark.component.scss',
    './chat.light.component.scss',
  ],
})
export class ChatComponent extends ThemedDirective implements DoCheck {
  @Input() messages: Message[] = [];

  protected timestamps: string[] = [];

  private readonly differ: IterableDiffer<Message>;

  constructor(
    protected override readonly themeService: ThemeService,
    private readonly iterableDiffers: IterableDiffers,
  ) {
    super(themeService);
    this.differ = this.iterableDiffers.find([]).create<Message>();
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
}
