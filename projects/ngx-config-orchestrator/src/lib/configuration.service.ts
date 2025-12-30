import { Inject, Injectable, Optional, computed, signal } from '@angular/core';
import { Observable, of } from 'rxjs';
import { catchError, map } from 'rxjs/operators';
import { ConfigurationLoader } from './configuration-loader.service';
import { APP_ENVIRONMENT, APP_SETTINGS, IAUTH_SETTINGS } from './tokens';
import { IAppSettings, IAuthSettings } from './types';
import { deepMerge } from './utils/deep-merge';

@Injectable({ providedIn: 'root' })
export class ConfigurationService {
  // Reactive State
  private readonly _settings = signal<IAppSettings>({} as IAppSettings);
  public readonly settings = computed(() => this._settings());

  constructor(
    private readonly loader: ConfigurationLoader,
    @Inject(APP_ENVIRONMENT) private readonly environment: any,
    @Inject(APP_SETTINGS) private readonly appSettingsToken: IAppSettings,
    @Inject(IAUTH_SETTINGS)
    @Optional()
    private readonly authSettingsToken?: IAuthSettings
  ) {}

  public loadSettings(): Observable<boolean> {
    return this.loader.loadManifest().pipe(
      map((remoteSettings) => {
        const mergedSettings = deepMerge(
          { ...this.environment },
          remoteSettings
        );

        // 1. Update Reactive Signal
        this._settings.set(mergedSettings);

        // 2. Update Injection Tokens (Legacy support)
        Object.assign(this.appSettingsToken, mergedSettings);

        if (this.authSettingsToken && mergedSettings.auth_settings) {
          Object.assign(this.authSettingsToken, mergedSettings.auth_settings);
        }

        return true;
      }),
      catchError((error) => {
        console.error(
          'ngx-config-orchestrator: Failed to load configuration.',
          error
        );
        return of(false);
      })
    );
  }
}
