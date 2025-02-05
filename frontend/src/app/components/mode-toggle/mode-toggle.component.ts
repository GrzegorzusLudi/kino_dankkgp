import { AsyncPipe, NgClass, NgIf } from '@angular/common';
import { Component } from '@angular/core';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { faMoon, faSun } from '@fortawesome/free-solid-svg-icons';

import { ThemedDirective } from '../../directives/themed/themed.directive';
import { Theme } from '../../models/theme.enum';
import { SwitchComponent } from './switch/switch.component';

@Component({
  selector: 'app-mode-toggle',
  imports: [SwitchComponent, NgIf, AsyncPipe, FontAwesomeModule, NgClass],
  templateUrl: './mode-toggle.component.html',
  styleUrls: [
    './mode-toggle.light.component.scss',
    './mode-toggle.dark.component.scss',
    './mode-toggle.aero-light.component.scss',
    './mode-toggle.aero-dark.component.scss',
  ],
})
export class ModeToggleComponent extends ThemedDirective {
  faSun = faSun;
  faMoon = faMoon;

  switchMode(currentTheme: Theme, checked: boolean): void {
    if (currentTheme === Theme.FlatLight || currentTheme === Theme.FlatDark) {
      this.themeService.changeTheme(checked ? Theme.FlatLight : Theme.FlatDark);
    } else {
      this.themeService.changeTheme(checked ? Theme.AeroLight : Theme.AeroDark);
    }
  }
}
