import { provideZonelessChangeDetection } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { MatDialogRef } from '@angular/material/dialog';

import { SOCKET } from '../../socket.token';
import { UsernameDialogComponent } from './username-dialog.component';

describe('UsernameDialogComponent', () => {
  let component: UsernameDialogComponent;
  let fixture: ComponentFixture<UsernameDialogComponent>;

  beforeEach(async () => {
    const mockSocket = { emit: vi.fn(), on: vi.fn() };
    const mockDialogReference = { close: vi.fn() };

    await TestBed.configureTestingModule({
      imports: [UsernameDialogComponent],
      providers: [
        { provide: SOCKET, useValue: mockSocket },
        { provide: MatDialogRef, useValue: mockDialogReference },
        provideZonelessChangeDetection(),
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(UsernameDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
