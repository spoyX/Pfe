import { ApplicationConfig } from '@angular/core';
import { provideRouter, withHashLocation } from '@angular/router';

import { routes } from './app.routes';
import { provideHttpClient, withFetch, withInterceptors } from '@angular/common/http';


import { provideAnimations } from '@angular/platform-browser/animations';
import { interceptInterceptor } from './core/interceptors/intercept.interceptor';
export const appConfig: ApplicationConfig = {
  providers: [
    provideRouter(routes),
  
   provideAnimations(),
   
  provideHttpClient(withFetch()
   ,withInterceptors([interceptInterceptor]))]
  
  
};
