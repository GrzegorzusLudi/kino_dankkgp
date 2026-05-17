import { NgClass } from '@angular/common';
import { Component, inject } from '@angular/core';

import { ThemedDirective } from 'theme';

@Component({
  selector: 'lib-title',
  imports: [NgClass],
  templateUrl: './title.component.html',
  styleUrls: [
    './title.flat.component.scss',
    './title.aero.component.scss',
  ],
  hostDirectives: [ThemedDirective]
})
export class TitleComponent {}
