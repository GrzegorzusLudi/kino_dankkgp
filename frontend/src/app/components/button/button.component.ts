import { AsyncPipe, NgClass, NgIf } from '@angular/common';
import { Component } from '@angular/core';

import { ThemedDirective } from '../../directives/themed/themed.directive';

@Component({
  selector: 'app-button',
  imports: [AsyncPipe, NgClass, NgIf],
  templateUrl: './button.component.html',
  styleUrls: [
    './button.aero-dark.component.scss',
    './button.aero-light.component.scss',
    './button.dark.component.scss',
    './button.light.component.scss',
  ],
})
export class ButtonComponent extends ThemedDirective {
  protected clicked = false;
}
