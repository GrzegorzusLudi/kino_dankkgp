import { FormControl } from '@angular/forms';

export interface ChatFormControls {
  message: FormControl<string | null>;
  username: FormControl<string | null>;
}
