import { Component, Input } from '@angular/core';
import { HeaderComponent } from "../header/header.component";

@Component({
  selector: 'app-toast',
  imports: [HeaderComponent],
  templateUrl: './toast.component.html',
  styleUrls: ['./toast.dark.component.scss', './toast.light.component.scss', './toast.aero-light.component.scss', './toast.aero-dark.component.scss'],
})
export class ToastComponent {
  @Input() title: string = '';
  @Input() message: string = '';
}
