import { provideZonelessChangeDetection } from '@angular/core';
import { TestBed } from '@angular/core/testing';

import { AppComponent } from './app.component';
import { SOCKET } from './app.config';

describe('AppComponent', () => {
  beforeEach(async () => {
    const mockSocket = { emit: vi.fn(), on: vi.fn() };

    await TestBed.configureTestingModule({
      imports: [AppComponent],
      providers: [
        { provide: SOCKET, useValue: mockSocket },
        provideZonelessChangeDetection(),
      ],
    }).compileComponents();
  });

  it('should create the app', () => {
    const fixture = TestBed.createComponent(AppComponent);
    const app = fixture.componentInstance;
    expect(app).toBeTruthy();
  });
});
