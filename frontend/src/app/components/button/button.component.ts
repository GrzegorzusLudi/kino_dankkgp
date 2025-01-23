import { AsyncPipe, NgClass, NgIf } from '@angular/common';
import { Component } from '@angular/core';

import { ThemedDirective } from '../../directives/themed/themed.directive';

@Component({
  selector: 'app-button',
  imports: [NgIf, NgClass, AsyncPipe],
  templateUrl: './button.component.html',
  styleUrls: [
    './button.light.component.scss',
    './button.dark.component.scss',
    './button.aero-light.component.scss',
    './button.aero-dark.component.scss',
  ],
})
export class ButtonComponent extends ThemedDirective {
  protected clicked = false;
}
