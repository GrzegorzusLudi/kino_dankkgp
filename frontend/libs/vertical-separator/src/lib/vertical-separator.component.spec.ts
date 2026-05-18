import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideZonelessChangeDetection } from '@angular/core';

import { VerticalSeparatorComponent } from './vertical-separator.component';

describe('VerticalSeparatorComponent', () => {
  let component: VerticalSeparatorComponent;
  let fixture: ComponentFixture<VerticalSeparatorComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [VerticalSeparatorComponent],
      providers: [provideZonelessChangeDetection()],
    }).compileComponents();

    fixture = TestBed.createComponent(VerticalSeparatorComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
