import { Component, inject } from '@angular/core';

import { ThemeService } from './theme.service';

interface ColorSwatch {
  variable: string;
  label: string;
}

interface ColorGroup {
  name: string;
  swatches: ColorSwatch[];
}

const STEPS = [0, 5, 10, 15, 20, 25, 30, 35, 40, 45, 50, 55, 60, 65, 70, 75, 80, 85, 90, 95, 100];

@Component({
  selector: 'lib-theme-palette',
  standalone: true,
  templateUrl: './theme-palette.component.html',
  styleUrl: './theme-palette.component.scss',
})
export class ThemePaletteComponent {
  readonly _themeService = inject(ThemeService);

  readonly groups: ColorGroup[] = [
    { name: 'Light Primary', swatches: this.swatches('light-primary') },
    { name: 'Dark Primary', swatches: this.swatches('dark-primary') },
    { name: 'Light Success', swatches: this.swatches('light-success') },
    { name: 'Light Danger', swatches: this.swatches('light-danger') },
    { name: 'Gray', swatches: this.swatches('gray') },
  ];

  private swatches(prefix: string): ColorSwatch[] {
  return STEPS.map((step) => ({
    variable: `--${prefix}-a${step}`,
    label: `a${step}`,
  }));
}
}
