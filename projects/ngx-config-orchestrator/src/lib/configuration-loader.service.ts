import { HttpBackend, HttpClient } from '@angular/common/http';
import { Injectable, PLATFORM_ID, inject } from '@angular/core';
import { Observable, of } from 'rxjs';
import { APP_SETTINGS_MANIFEST_URL } from './tokens';
import { IAppSettings } from './types';
import { isPlatformBrowser } from '@angular/common';

@Injectable({ providedIn: 'root' })
export class ConfigurationLoader {
  private readonly http = new HttpClient(inject(HttpBackend));
  private readonly platformId = inject(PLATFORM_ID);
  private readonly manifestUrl = inject(APP_SETTINGS_MANIFEST_URL);

  public loadManifest(): Observable<IAppSettings> {
    if (isPlatformBrowser(this.platformId)) {
      return this.http.get<IAppSettings>(this.manifestUrl);
    }

    // If Server (SSR), return empty object immediately (avoids NetworkError)
    return of({} as IAppSettings);
  }
}
