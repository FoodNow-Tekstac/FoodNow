import { ApplicationConfig } from '@angular/core';
import { provideRouter , withDebugTracing} from '@angular/router';
import { provideHttpClient, withInterceptors } from '@angular/common/http'; // Import withInterceptors
import { jwtInterceptor } from './auth/jwt.interceptor'; // Import the interceptor
import { provideAnimations } from '@angular/platform-browser/animations'; // <-- IMPORT THIS

import { routes } from './app.routes';

export const appConfig: ApplicationConfig = {
  providers: [
    provideRouter(routes,withDebugTracing()),
    provideHttpClient(withInterceptors([jwtInterceptor])),
        provideAnimations() 

  ]
};