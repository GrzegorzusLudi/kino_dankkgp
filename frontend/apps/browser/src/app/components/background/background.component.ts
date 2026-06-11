import { Component } from '@angular/core';

import { ThemedDirective } from 'theme';

@Component({
  selector: 'app-background',
  imports: [],
  templateUrl: './background.component.html',
  styleUrls: [
    './background.aero.component.scss',
    './background.flat.component.scss',
  ],
  hostDirectives: [ThemedDirective],
})
export class BackgroundComponent {}
