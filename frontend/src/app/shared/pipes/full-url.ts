import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'fullUrl',
  standalone: true
})
export class FullUrlPipe implements PipeTransform {
  private baseUrl = 'http://localhost:8080'; // Your backend URL

  transform(value: string | null | undefined): string {
    console.log('FullUrlPipe input:', value); // Debug log
    
    if (!value) {
      console.log('FullUrlPipe: No value provided, returning empty string');
      return '';
    }

    // If it's already a full URL, return as is
    if (value.startsWith('http://') || value.startsWith('https://')) {
      console.log('FullUrlPipe: Full URL detected, returning:', value);
      return value;
    }

    // If it starts with /uploads, prepend base URL
    if (value.startsWith('/uploads/')) {
      const fullUrl = this.baseUrl + value;
      console.log('FullUrlPipe: Transformed URL:', fullUrl);
      return fullUrl;
    }

    // If it doesn't start with /, add it
    const normalizedPath = value.startsWith('/') ? value : '/' + value;
    const fullUrl = this.baseUrl + normalizedPath;
    console.log('FullUrlPipe: Normalized and transformed URL:', fullUrl);
    return fullUrl;
  }
}