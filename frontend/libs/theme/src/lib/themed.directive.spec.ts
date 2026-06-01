import { TestBed } from '@angular/core/testing';

import { ThemedDirective } from './themed.directive';

describe('ThemedDirective', () => {
  it('should create an instance', () => {
    TestBed.configureTestingModule({});
    const directive = TestBed.runInInjectionContext(
      () => new ThemedDirective(),
    );
    expect(directive).toBeTruthy();
  });
});
