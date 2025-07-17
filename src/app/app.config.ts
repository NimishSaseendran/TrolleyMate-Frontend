import { ApplicationConfig, provideZoneChangeDetection } from '@angular/core';
import { provideRouter } from '@angular/router';
import { provideHttpClient } from '@angular/common/http';
import { provideAnimations } from '@angular/platform-browser/animations'; // Required for Toastr
import { ToastrModule } from 'ngx-toastr';
import { routes } from './app.routes';

export const appConfig: ApplicationConfig = {
  providers: [
    provideZoneChangeDetection({ eventCoalescing: true }),
    provideRouter(routes),
    provideHttpClient(),
    provideAnimations(),
    ...(ToastrModule.forRoot({
      positionClass: 'toast-top-right',
      timeOut: 3000,
      closeButton: true,
      preventDuplicates: true
    }).providers ?? [])
  ]
};
