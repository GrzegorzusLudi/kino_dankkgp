import { Component } from '@angular/core';

import { ThemedDirective } from 'theme';

@Component({
  selector: 'lib-footer',
  templateUrl: './footer.component.html',
  styleUrls: ['./footer.flat.component.scss', './footer.aero.component.scss'],
  hostDirectives: [ThemedDirective],
})
export class FooterComponent {}
