import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'titlecase'
})
export class TitleCasePipe implements PipeTransform {

  transform(value: string): string {
    if (!value) return value;

    // Step 1: Insert spaces between camelCase or PascalCase words
    const separatedWords = value.replace(/([a-z])([A-Z])/g, '$1 $2');

    // Step 2: Capitalize the first letter of each word, and make the rest lowercase
    return separatedWords
      .split(' ')  // Split into an array of words
      .map(word => {
        // Capitalize first letter, make the rest lowercase
        return word.charAt(0).toUpperCase() + word.slice(1).toLowerCase();
      }).join(' '); // Join the words back with spaces
  }
}
