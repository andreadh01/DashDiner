import { Directive, ElementRef, HostListener } from '@angular/core';

@Directive({
  selector: '[appFourDigitInput]'
})
export class FourDigitInputDirective {

  constructor(private el: ElementRef) {}

  @HostListener('input', ['$event']) onInput(event: Event): void {
    const input = event.target as HTMLInputElement;
    let inputValue = input.value;

    // Eliminar caracteres no numéricos y limitar a 4 dígitos después del primer dígito
    inputValue = inputValue.replace(/[^0-9]/g, ''); // Eliminar caracteres no numéricos
    inputValue = inputValue.slice(0, 1) + inputValue.slice(1).replace(/\D/g, '').slice(0, 3);
    input.value = inputValue;
    input.dispatchEvent(new Event('input')); // Disparar evento de entrada para que Angular actualice el modelo
  }
}
