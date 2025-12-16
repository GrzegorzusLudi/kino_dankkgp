import { TestBed } from '@angular/core/testing';

import { SOCKET } from './app.config';
import { AppComponent } from './app.component';

describe('AppComponent', () => {
  beforeEach(async () => {
    const mockSocket = jasmine.createSpyObj('Socket', ['emit', 'on']);

    await TestBed.configureTestingModule({
      imports: [AppComponent],
      providers: [{ provide: SOCKET, useValue: mockSocket }],
    }).compileComponents();
  });

  it('should create the app', () => {
    const fixture = TestBed.createComponent(AppComponent);
    const app = fixture.componentInstance;
    expect(app).toBeTruthy();
  });
});
