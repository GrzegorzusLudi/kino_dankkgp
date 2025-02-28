import { AsyncPipe, NgClass, NgIf } from '@angular/common';
import { Component } from '@angular/core';

import { ThemedDirective } from '../../directives/themed/themed.directive';

@Component({
  selector: 'app-vertical-separator',
  imports: [AsyncPipe, NgClass, NgIf],
  templateUrl: './vertical-separator.component.html',
  styleUrls: [
    './vertical-separator.aero-dark.component.scss',
    './vertical-separator.aero-light.component.scss',
    './vertical-separator.dark.component.scss',
    './vertical-separator.light.component.scss',
  ],
})
export class VerticalSeparatorComponent extends ThemedDirective {}
