import { AsyncPipe, NgIf } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { Observable } from 'rxjs';

import { BackgroundComponent } from './components/background/background.component';
import { ButtonComponent } from './components/button/button.component';
import { SwitchComponent } from './components/switch/switch.component';
import { TitleComponent } from './components/title/title.component';
import { ToolbarComponent } from './components/toolbar/toolbar.component';
import { Theme } from './models/theme.enum';
import { ThemeService } from './services/theme/theme.service';

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
export class AppComponent implements OnInit {
  title = 'Kino DANKKGP';

  protected theme!: Observable<Theme>;

  constructor(private readonly themeService: ThemeService) {}

  ngOnInit(): void {
    this.theme = this.themeService.getTheme();
  }

  switchMode(currentTheme: Theme, checked: boolean): void {
    if (currentTheme === Theme.FlatLight || currentTheme === Theme.FlatDark) {
      this.themeService.changeTheme(checked ? Theme.FlatLight : Theme.FlatDark);
    } else {
      this.themeService.changeTheme(checked ? Theme.AeroLight : Theme.AeroDark);
    }
  }
}
