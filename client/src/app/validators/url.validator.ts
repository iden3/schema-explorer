import { AbstractControl, ValidationErrors, ValidatorFn } from '@angular/forms';

const urlSchemas = ['http://', 'https://', 'ipfs://'];

export function urlValidator(): ValidatorFn {
  return (control: AbstractControl): ValidationErrors | null => {
    const isValid = urlSchemas.some(s => (control.value ?? '').startsWith(s));
    return !isValid ? { url: { value: control.value } } : null;
  };
}
