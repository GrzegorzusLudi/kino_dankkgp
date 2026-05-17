import { Component, Input } from '@angular/core';

import { ThemedDirective } from 'theme';

@Component({
  selector: 'lib-button',
  imports: [],
  templateUrl: './button.component.html',
  styleUrls: [
    './button.aero.component.scss',
    './button.flat.component.scss',
  ],
})
export class ButtonComponent extends ThemedDirective {
  @Input() variant: 'primary' | 'ghost' = 'primary';
  @Input() height: 'small' | 'medium' = 'medium';

  protected clicked = false;
}
