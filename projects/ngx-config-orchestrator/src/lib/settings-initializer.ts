import { EnvironmentProviders, Injector, makeEnvironmentProviders, provideAppInitializer, inject } from '@angular/core';
import { lastValueFrom } from 'rxjs';
import { ConfigurationService } from './configuration.service';
import { APP_ENVIRONMENT, APP_PROVIDERS_ARRAY, APP_SETTINGS, APP_SETTINGS_MANIFEST_URL, IAUTH_SETTINGS } from './tokens';
import { AppProvidersArray, IAppSettings } from './types';

/**
 * The initialization logic that runs before the app starts.
 * It uses `inject()` to get dependencies within the injection context.
 */
export async function initializeAppLogic(): Promise<void> {
  const configService = inject(ConfigurationService);
  const injector = inject(Injector);

  // Load settings and wait for completion
  const success = await lastValueFrom(configService.loadSettings());

  if (success) {
    const dependencies = injector.get(APP_PROVIDERS_ARRAY, []);
    if (dependencies.length > 0) {
      // Initialize runtime dependencies that wait for config
      Injector.create({ providers: dependencies, parent: injector });
    }
  }
}

export function provideConfigOrchestrator(config: AppProvidersArray = {}): EnvironmentProviders {
  return makeEnvironmentProviders([
    { provide: APP_SETTINGS_MANIFEST_URL, useValue: config.manifestUrl || '/assets/app-settings.manifest.json' },
    { provide: APP_PROVIDERS_ARRAY, useValue: config.dependencies || [] },
    { provide: APP_ENVIRONMENT, useValue: config.environment || {} },
    { provide: APP_SETTINGS, useValue: {} },
    { 
      provide: IAUTH_SETTINGS, 
      useFactory: () => inject(APP_SETTINGS).auth_settings || {}, 
    },
    // Modern initialization provider
    provideAppInitializer(initializeAppLogic),
  ]);
}