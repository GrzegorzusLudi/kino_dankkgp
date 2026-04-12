import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';

import { Theme } from './theme.enum';

@Injectable({
  providedIn: 'root',
})
export class ThemeService {
  private readonly theme = new BehaviorSubject<Theme>(Theme.FlatDark);

  getTheme(): Observable<Theme> {
    return this.theme.asObservable();
  }

  changeTheme(theme: Theme): void {
    this.theme.next(theme);
  }
}
