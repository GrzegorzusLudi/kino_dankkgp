import { AsyncPipe, NgClass, NgFor, NgIf } from '@angular/common';
import { Component, Input } from '@angular/core';

import { ThemedDirective } from '../../directives/themed/themed.directive';
import { Message } from '../../models/message.interface';
import { ButtonComponent } from '../button/button.component';
import { HeaderComponent } from '../header/header.component';

@Component({
  selector: 'app-chat',
  imports: [AsyncPipe, ButtonComponent, HeaderComponent, NgClass, NgFor, NgIf],
  templateUrl: './chat.component.html',
  styleUrls: [
    './chat.aero-dark.component.scss',
    './chat.aero-light.component.scss',
    './chat.dark.component.scss',
    './chat.light.component.scss',
  ],
})
export class ChatComponent extends ThemedDirective {
  @Input() messages: Message[] = [];
}
