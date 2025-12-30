import { HttpBackend, HttpClient } from '@angular/common/http';
import { Inject, Injectable, PLATFORM_ID } from '@angular/core';
import { Observable, of } from 'rxjs';
import { APP_SETTINGS_MANIFEST_URL } from './tokens';
import { IAppSettings } from './types';
import { isPlatformBrowser } from '@angular/common';

@Injectable({ providedIn: 'root' })
export class ConfigurationLoader {
  private http: HttpClient;
  constructor(
    handler: HttpBackend,
    @Inject(PLATFORM_ID) private readonly platformId: object,
    @Inject(APP_SETTINGS_MANIFEST_URL) private readonly manifestUrl: string
  ) {
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
