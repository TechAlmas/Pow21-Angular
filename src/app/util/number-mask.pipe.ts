import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'mask'
})
export class NumberMaskPipe implements PipeTransform {
  transform(number: string): string {
    const visibleDigits = 4;
    let maskedSection = number.slice(0, -visibleDigits);
    let visibleSection = number.slice(-visibleDigits);
    return maskedSection.replace(/./g, '*') + visibleSection;
  }
}