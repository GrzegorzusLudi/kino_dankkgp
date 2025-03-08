import { AsyncPipe, NgClass, NgIf } from '@angular/common';
import { Component } from '@angular/core';

import { ThemedDirective } from '../../directives/themed/themed.directive';

@Component({
  selector: 'app-header',
  imports: [AsyncPipe, NgClass, NgIf],
  templateUrl: './header.component.html',
  styleUrls: [
    './header.aero-dark.component.scss',
    './header.aero-light.component.scss',
    './header.dark.component.scss',
    './header.light.component.scss',
  ],
})
export class HeaderComponent extends ThemedDirective {}
