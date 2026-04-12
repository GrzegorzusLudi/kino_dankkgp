import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SOCKET } from '../../app.config';
import { ChatComponent } from './chat.component';

describe('ChatComponent', () => {
  let component: ChatComponent;
  let fixture: ComponentFixture<ChatComponent>;

  beforeEach(async () => {
    const mockSocket = jasmine.createSpyObj('Socket', ['emit', 'on']);

    await TestBed.configureTestingModule({
      imports: [ChatComponent],
      providers: [{ provide: SOCKET, useValue: mockSocket }],
    }).compileComponents();

    fixture = TestBed.createComponent(ChatComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
