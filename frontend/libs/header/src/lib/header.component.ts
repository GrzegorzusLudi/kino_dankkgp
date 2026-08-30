import { ChangeDetectionStrategy, Component } from '@angular/core';

import { ThemedDirective } from 'theme';

@Component({
  selector: 'lib-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.flat.component.scss', './header.aero.component.scss'],
  hostDirectives: [ThemedDirective],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class HeaderComponent {}
