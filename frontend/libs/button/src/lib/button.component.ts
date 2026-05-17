import { Component, Input } from '@angular/core';

import { ThemedDirective } from 'theme';

@Component({
  selector: 'lib-button',
  templateUrl: './button.component.html',
  styleUrls: ['./button.aero.component.scss', './button.flat.component.scss'],
  hostDirectives: [ThemedDirective],
})
export class ButtonComponent {
  @Input() variant: 'primary' | 'ghost' = 'primary';
  @Input() height: 'small' | 'medium' = 'medium';

  protected clicked = false;
}
