import { AsyncPipe, NgClass, NgIf } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { Observable } from 'rxjs';

import { Theme } from '../../models/theme.enum';
import { ThemeService } from '../../services/theme/theme.service';

@Component({
  selector: 'app-toolbar',
  imports: [NgClass, NgIf, AsyncPipe],
  templateUrl: './toolbar.component.html',
  styleUrls: [
    './toolbar.light.component.scss',
    './toolbar.dark.component.scss',
    './toolbar.aero-light.component.scss',
    './toolbar.aero-dark.component.scss',
  ],
})
export class ToolbarComponent implements OnInit {
  protected theme!: Observable<Theme>;

  constructor(private readonly themeService: ThemeService) {}

  ngOnInit(): void {
    this.theme = this.themeService.getTheme();
  }
}
