import { Pipe, PipeTransform } from '@angular/core';
import { environment } from '../../../environments/environment';

@Pipe({
  name: 'fullUrl',
  standalone: true
})
export class FullUrlPipe implements PipeTransform {

  transform(relativePath: string | undefined | null): string {
    // If the value is empty, return an empty string
    if (!relativePath) {
      return '';
    }

    // If the value is already a full URL, don't change it
    if (relativePath.startsWith('http')) {
      return relativePath;
    }

    // Otherwise, prepend the backend URL from our environment file
    return `${environment.backendBaseUrl}${relativePath}`;
  }
}