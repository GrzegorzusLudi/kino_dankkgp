import { Component } from '@angular/core';
import { TestBed } from '@angular/core/testing';

import { ThemedDirective } from './themed.directive';

@Component({
  template: '<div><span>test</span></div>',
  hostDirectives: [ThemedDirective],
})
class TestHostComponent {}

describe('ThemedDirective', () => {
  it('should create an instance', () => {
    TestBed.configureTestingModule({
      imports: [TestHostComponent],
    });
    const fixture = TestBed.createComponent(TestHostComponent);
    fixture.detectChanges();
    expect(fixture.componentInstance).toBeTruthy();
  });
});
