import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'maskCardNumber',
})
export class MaskCardNumberPipe implements PipeTransform {
  transform(value: string): string {
    if (!value) return '';

    const blocks = value.trim().split(' ');

    const len = blocks.length;
    if (len < 2) return value;

    if (len >= 2) {
      blocks[len - 2] = '****';
    }

    if (len >= 1) {
      const last = blocks[len - 1];
      blocks[len - 1] = '**' + last.slice(2);
    }

    return blocks.join(' ');
  }
}
