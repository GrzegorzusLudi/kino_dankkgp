import { Component, inject } from '@angular/core';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { faMoon, faSun } from '@fortawesome/free-solid-svg-icons';

import { THEME, Theme, ThemedDirective, ThemeService } from 'theme';
import { SwitchComponent } from 'switch';

@Component({
  selector: 'app-mode-toggle',
  imports: [FontAwesomeModule, SwitchComponent],
  hostDirectives: [ThemedDirective],
  templateUrl: './mode-toggle.component.html',
  styleUrls: [
    './mode-toggle.aero.component.scss',
    './mode-toggle.flat.component.scss',
  ],
})
export class ModeToggleComponent {
  protected readonly theme = inject(THEME);
  private readonly themeService: ThemeService = inject(ThemeService);

  faSun = faSun;
  faMoon = faMoon;

  switchMode(currentTheme: string, checked: boolean): void {
    if (currentTheme === Theme.FlatLight || currentTheme === Theme.FlatDark) {
      this.themeService.changeTheme(checked ? Theme.FlatLight : Theme.FlatDark);
    } else {
      this.themeService.changeTheme(checked ? Theme.AeroLight : Theme.AeroDark);
    }
  }
}
