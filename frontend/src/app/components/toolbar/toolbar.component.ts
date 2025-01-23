import { AsyncPipe, NgClass, NgIf } from '@angular/common';
import { Component } from '@angular/core';

import { ThemedDirective } from '../../directives/themed/themed.directive';

@Component({
  selector: 'app-toolbar',
  imports: [NgClass, NgIf, AsyncPipe],
  templateUrl: './toolbar.component.html',
  styleUrls: [
    './toolbar.light.component.scss',
    './toolbar.dark.component.scss',
    './toolbar.aero-light.component.scss',
    './toolbar.aero-dark.component.scss',
  ],
})
export class ToolbarComponent extends ThemedDirective {}
