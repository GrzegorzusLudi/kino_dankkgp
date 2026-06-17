import { Component } from '@angular/core';

import { ThemedDirective } from 'theme';

@Component({
  selector: 'lib-toolbar',
  templateUrl: './toolbar.component.html',
  styleUrls: ['./toolbar.aero.component.scss', './toolbar.flat.component.scss'],
  hostDirectives: [ThemedDirective],
})
export class ToolbarComponent {}
