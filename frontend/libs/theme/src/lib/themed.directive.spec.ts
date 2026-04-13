import { TestBed } from '@angular/core/testing';

import { ThemeService } from './theme.service';
import { ThemedDirective } from './themed.directive';

describe('ThemedDirective', () => {
  it('should create an instance', () => {
    TestBed.configureTestingModule({ providers: [ThemeService] });
    const directive = TestBed.runInInjectionContext(
      () => new ThemedDirective(TestBed.inject(ThemeService))
    );
    expect(directive).toBeTruthy();
  });
});
