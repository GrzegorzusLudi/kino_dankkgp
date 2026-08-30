import {
  ChangeDetectionStrategy,
  Component,
  computed,
  inject,
} from '@angular/core';
import { DOCUMENT } from '@angular/common';

import { ColorGroup } from './color-group.interface';
import { ColorSwatch } from './color-swatch.interface';
import { COLOR_STEPS } from './theme.consts';
import { THEME_PALETTE_GROUPS } from './theme-palette.config';
import { ThemeService } from './theme.service';

@Component({
  selector: 'lib-theme-palette',
  templateUrl: './theme-palette.component.html',
  styleUrl: './theme-palette.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ThemePaletteComponent {
  private readonly document = inject(DOCUMENT);
  private readonly themeService = inject(ThemeService);

  protected readonly groups = computed<ColorGroup[]>(() => {
    this.themeService.theme();

    return THEME_PALETTE_GROUPS.map(({ name, prefix }) => ({
      name,
      swatches: this.swatches(prefix),
    }));
  });

  private swatches(prefix: string): ColorSwatch[] {
    const style = this.document.documentElement.style;

    return COLOR_STEPS.map((step) => {
      const variable = `--${prefix}-a${step}`;

      return {
        variable,
        hex: style.getPropertyValue(variable).trim(),
      };
    });
  }
}
