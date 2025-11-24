import { ApplicationConfig } from '@angular/core';
import { provideHttpClient, withInterceptorsFromDi } from '@angular/common/http';
import { provideConfigOrchestrator } from 'ngx-config-orchestrator';

export const appConfig: ApplicationConfig = {
  providers: [
    provideHttpClient(),
    provideConfigOrchestrator({
      environment: {test: true},
      manifestUrl: '/assets/app-settings.manifest.json'
    })
  ]
};
