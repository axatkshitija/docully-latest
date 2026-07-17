
import { Directive, HostListener } from '@angular/core';

@Directive({
  selector: '[appNoScientificNotation]'
})
export class appNoScientificNotation {

  @HostListener('keypress', ['$event'])
  onKeyPress(event: KeyboardEvent) {
    // Prevent input of '-', '+', or 'e'
    if (['-', '+', 'e', 'E'].includes(event.key)) {
      event.preventDefault();
    }
  }

  @HostListener('input', ['$event'])
  onInput(event: any) {
    // Remove any characters that are not digits
    const initialValue = event.target.value;
    event.target.value = initialValue.replace(/[^0-9]/g, '');
    if (initialValue !== event.target.value) {
      event.stopPropagation();
    }
  }
}
