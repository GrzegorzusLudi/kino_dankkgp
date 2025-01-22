import { AsyncPipe, NgClass, NgIf } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { Observable } from 'rxjs';

import { Theme } from '../../models/theme.enum';
import { ThemeService } from '../../services/theme/theme.service';

@Component({
  selector: 'app-background',
  imports: [NgIf, NgClass, AsyncPipe],
  templateUrl: './background.component.html',
  styleUrls: [
    './background.light.component.scss',
    './background.dark.component.scss',
    './background.aero-light.component.scss',
    './background.aero-dark.component.scss',
  ],
})
export class BackgroundComponent implements OnInit {
  protected theme!: Observable<Theme>;

  constructor(private readonly themeService: ThemeService) {}

  ngOnInit(): void {
    this.theme = this.themeService.getTheme();
  }
}
