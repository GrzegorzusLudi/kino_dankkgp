import { Component } from '@angular/core';

import { ThemedDirective } from 'theme';

@Component({
  selector: 'lib-toolbar',
  templateUrl: './toolbar.component.html',
  styleUrls: [
    './toolbar.aero-dark.component.scss',
    './toolbar.aero-light.component.scss',
    './toolbar.dark.component.scss',
    './toolbar.light.component.scss',
  ],
  hostDirectives: [ThemedDirective],
})
export class ToolbarComponent {}
