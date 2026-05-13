import { NgClass } from '@angular/common';
import { Component, inject, Input } from '@angular/core';

import { THEME } from 'theme';

@Component({
    selector: 'lib-button',
    imports: [NgClass],
    templateUrl: './button.component.html',
    styleUrls: ['./button.aero-dark.component.scss', './button.aero-light.component.scss', './button.dark.component.scss', './button.light.component.scss']
})
export class ButtonComponent {
    protected readonly theme = inject(THEME);

    @Input() variant: 'primary' | 'ghost' = 'primary';
    @Input() height: 'small' | 'medium' = 'medium';

    protected clicked = false;
}
