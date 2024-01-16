import { AbstractControl } from '@angular/forms';

export class ConfirmPasswordValidator {
  static MatchPassword(control: AbstractControl) {
    let password = control.get('password').value;
    let password_confirmation = control.get('password_confirmation').value;
    if (password !== password_confirmation) {
      control.get('password_confirmation').setErrors({ password_confirmation: true });
    }
    else {
      return null;
    }
  }
}