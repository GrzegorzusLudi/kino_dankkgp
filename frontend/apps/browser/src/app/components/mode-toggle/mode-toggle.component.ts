import { NgClass } from '@angular/common';
import { Component, inject } from '@angular/core';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { faMoon, faSun } from '@fortawesome/free-solid-svg-icons';

import { THEME, Theme, ThemeService } from 'theme';
import { SwitchComponent } from './switch/switch.component';

@Component({
  selector: 'app-mode-toggle',
  imports: [FontAwesomeModule, NgClass, SwitchComponent],
  templateUrl: './mode-toggle.component.html',
  styleUrls: [
    './mode-toggle.aero-dark.component.scss',
    './mode-toggle.aero-light.component.scss',
    './mode-toggle.dark.component.scss',
    './mode-toggle.light.component.scss',
  ],
})
export class ModeToggleComponent {
  protected readonly theme = inject(THEME);
  private readonly themeService = inject(ThemeService);

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
