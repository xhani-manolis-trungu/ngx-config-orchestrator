import { ApplicationConfig } from '@angular/core';
import { provideHttpClient, withInterceptorsFromDi } from '@angular/common/http';
import { provideConfigOrchestrator } from 'ngx-config-orchestrator';

export const appConfig: ApplicationConfig = {
  providers: [
    provideHttpClient(),
    provideConfigOrchestrator({
      environment: {test: false, production: true},
      manifestUrl: '/assets/app-settings.manifest.json'
    })
  ]
};
