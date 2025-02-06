import { AsyncPipe, NgClass, NgFor, NgIf } from '@angular/common';
import { Component, Input } from '@angular/core';

import { ThemedDirective } from '../../directives/themed/themed.directive';
import { Message } from '../../models/message.interface';

@Component({
  selector: 'app-chat',
  imports: [NgClass, NgIf, AsyncPipe, NgFor],
  templateUrl: './chat.component.html',
  styleUrls: [
    './chat.aero-light.component.scss',
    './chat.aero-dark.component.scss',
    './chat.dark.component.scss',
    './chat.light.component.scss',
  ],
})
export class ChatComponent extends ThemedDirective {
  @Input() messages: Message[] = [];
}
