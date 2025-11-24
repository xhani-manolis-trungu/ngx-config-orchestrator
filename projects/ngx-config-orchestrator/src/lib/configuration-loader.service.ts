import { HttpBackend, HttpClient } from '@angular/common/http';
import { Injectable, PLATFORM_ID, inject } from '@angular/core';
import { Observable, of } from 'rxjs';
import { APP_SETTINGS_MANIFEST_URL } from './tokens';
import { IAppSettings } from './types';
import { isPlatformBrowser } from '@angular/common';

@Injectable({ providedIn: 'root' })
export class ConfigurationLoader {
  private http: HttpClient;
  private readonly platformId = inject(PLATFORM_ID);
  private readonly manifestUrl = inject(APP_SETTINGS_MANIFEST_URL);

  constructor(handler: HttpBackend) {
    // Bypasses interceptors to ensure config loads raw
    this.http = new HttpClient(handler);
  }

  public loadManifest(): Observable<IAppSettings> {
    if (isPlatformBrowser(this.platformId)) {
      return this.http.get<IAppSettings>(this.manifestUrl);
    }

    // If Server (SSR), return empty object immediately (avoids NetworkError)
    return of({} as IAppSettings);
  }
}
