import { Component, EventEmitter, Output } from '@angular/core';

@Component({
  selector: 'app-switch',
  imports: [],
  templateUrl: './switch.component.html',
  styleUrl: './switch.component.scss',
})
export class SwitchComponent {
  // TODO Rename to toggle?
  @Output() switch = new EventEmitter<boolean>();

  emit(event: Event): void {
    this.switch.next((event.target as HTMLInputElement)['checked']);
  }
}
