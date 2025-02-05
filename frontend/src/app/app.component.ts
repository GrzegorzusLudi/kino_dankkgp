import { AsyncPipe, NgIf } from '@angular/common';
import { Component } from '@angular/core';

import { BackgroundComponent } from './components/background/background.component';
import { ButtonComponent } from './components/button/button.component';
import { ModeToggleComponent } from './components/mode-toggle/mode-toggle.component';
import { TitleComponent } from './components/title/title.component';
import { ToolbarComponent } from './components/toolbar/toolbar.component';
import { ThemedDirective } from './directives/themed/themed.directive';

@Component({
  selector: 'app-root',
  imports: [
    BackgroundComponent,
    ButtonComponent,
    ToolbarComponent,
    BackgroundComponent,
    NgIf,
    AsyncPipe,
    TitleComponent,
    ModeToggleComponent,
  ],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss',
})
export class AppComponent extends ThemedDirective {
  title = 'Kino DANKKGP';
}
