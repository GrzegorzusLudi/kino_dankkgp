import { AsyncPipe, NgIf } from '@angular/common';
import { Component } from '@angular/core';

import { BackgroundComponent } from './components/background/background.component';
import { ButtonComponent } from './components/button/button.component';
import { SwitchComponent } from './components/switch/switch.component';
import { TitleComponent } from './components/title/title.component';
import { ToolbarComponent } from './components/toolbar/toolbar.component';
import { ThemedDirective } from './directives/themed/themed.directive';
import { Theme } from './models/theme.enum';

@Component({
  selector: 'app-root',
  imports: [
    BackgroundComponent,
    ButtonComponent,
    ToolbarComponent,
    BackgroundComponent,
    SwitchComponent,
    NgIf,
    AsyncPipe,
    TitleComponent,
  ],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss',
})
export class AppComponent extends ThemedDirective {
  title = 'Kino DANKKGP';

  switchMode(currentTheme: Theme, checked: boolean): void {
    if (currentTheme === Theme.FlatLight || currentTheme === Theme.FlatDark) {
      this.themeService.changeTheme(checked ? Theme.FlatLight : Theme.FlatDark);
    } else {
      this.themeService.changeTheme(checked ? Theme.AeroLight : Theme.AeroDark);
    }
  }
}
