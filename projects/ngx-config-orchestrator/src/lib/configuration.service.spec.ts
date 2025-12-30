import { signal } from '@angular/core';
import { of, throwError } from 'rxjs';
import { ConfigurationService } from './configuration.service';
import { ConfigurationLoader } from './configuration-loader.service';
import { IAppSettings, IAuthSettings } from './types';

describe('ConfigurationService', () => {
  let service: ConfigurationService;
  let loaderSpy: jasmine.SpyObj<ConfigurationLoader>;
  let appSettingsToken: IAppSettings;
  let authSettingsToken: IAuthSettings | undefined;
  let environmentToken: Partial<IAppSettings>;

  beforeEach(() => {
    // Create spy for ConfigurationLoader
    loaderSpy = jasmine.createSpyObj('ConfigurationLoader', ['loadManifest']);

    // Create mock tokens
    appSettingsToken = {} as IAppSettings;
    authSettingsToken = {} as IAuthSettings;
    environmentToken = {
      api_url: 'http://env.com',
      production: false,
    };

    // Create service instance manually with mocked dependencies
    service = new ConfigurationService(
      loaderSpy,
      environmentToken,
      appSettingsToken,
      authSettingsToken
    );
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  describe('loadSettings', () => {
    it('should load and merge remote settings with environment', (done) => {
      const remoteSettings: IAppSettings = {
        api_url: 'http://remote.com',
        version: '1.0.0',
        production: true,
      };

      loaderSpy.loadManifest.and.returnValue(of(remoteSettings));

      service.loadSettings().subscribe({
        next: (result) => {
          expect(result).toBe(true);

          // Verify signal was updated
          const settings = service.settings();
          expect(settings.api_url).toBe('http://remote.com');
          expect(settings.version).toBe('1.0.0');
          expect(settings.production).toBe(true);

          // Verify token was updated
          expect(appSettingsToken.api_url).toBe('http://remote.com');
          expect(appSettingsToken.version).toBe('1.0.0');

          done();
        },
        error: done.fail,
      });
    });

    it('should merge environment settings with remote settings', (done) => {
      const remoteSettings: IAppSettings = {
        api_url: 'http://remote.com',
        version: '1.0.0',
        production: true,
      };

      loaderSpy.loadManifest.and.returnValue(of(remoteSettings));

      service.loadSettings().subscribe({
        next: (result) => {
          expect(result).toBe(true);

          const settings = service.settings();
          // Remote settings should override environment
          expect(settings.api_url).toBe('http://remote.com');
          expect(settings.production).toBe(true);
          expect(settings.version).toBe('1.0.0');

          done();
        },
        error: done.fail,
      });
    });

    it('should update auth settings token when auth_settings are present', (done) => {
      const remoteSettings: IAppSettings = {
        api_url: 'http://remote.com',
        version: '1.0.0',
        production: true,
        auth_settings: {
          authority: 'http://auth.com',
          client_id: 'test-client',
          redirect_uri: 'http://localhost',
          response_type: 'code',
          scope: 'openid profile',
        },
      };

      loaderSpy.loadManifest.and.returnValue(of(remoteSettings));

      service.loadSettings().subscribe({
        next: (result) => {
          expect(result).toBe(true);

          // Verify auth settings token was updated
          expect(authSettingsToken!.authority).toBe('http://auth.com');
          expect(authSettingsToken!.client_id).toBe('test-client');

          done();
        },
        error: done.fail,
      });
    });

    it('should not update auth settings token when auth_settings are not present', (done) => {
      const remoteSettings: IAppSettings = {
        api_url: 'http://remote.com',
        version: '1.0.0',
        production: true,
      };

      loaderSpy.loadManifest.and.returnValue(of(remoteSettings));

      // Clear auth settings token
      if (authSettingsToken) {
        Object.keys(authSettingsToken).forEach(
          (key) => delete (authSettingsToken as any)[key]
        );
      }

      service.loadSettings().subscribe({
        next: (result) => {
          expect(result).toBe(true);

          // Verify auth settings token was not modified
          expect(Object.keys(authSettingsToken || {}).length).toBe(0);

          done();
        },
        error: done.fail,
      });
    });

    it('should handle errors gracefully and return false', (done) => {
      const error = new Error('Network error');
      loaderSpy.loadManifest.and.returnValue(throwError(() => error));

      spyOn(console, 'error');

      service.loadSettings().subscribe({
        next: (result) => {
          expect(result).toBe(false);
          expect(console.error).toHaveBeenCalledWith(
            'ngx-config-orchestrator: Failed to load configuration.',
            error
          );
          done();
        },
        error: done.fail,
      });
    });

    it('should update reactive signal on successful load', (done) => {
      const remoteSettings: IAppSettings = {
        api_url: 'http://remote.com',
        version: '2.0.0',
        production: false,
      };

      loaderSpy.loadManifest.and.returnValue(of(remoteSettings));

      // Initial state should be empty
      expect(service.settings()).toEqual({} as IAppSettings);

      service.loadSettings().subscribe({
        next: () => {
          // Signal should be updated
          const settings = service.settings();
          expect(settings).toBeTruthy();
          expect(settings.api_url).toBe('http://remote.com');
          expect(settings.version).toBe('2.0.0');
          expect(settings.production).toBe(false);

          done();
        },
        error: done.fail,
      });
    });

    it('should handle empty remote settings', (done) => {
      const remoteSettings: IAppSettings = {} as IAppSettings;

      loaderSpy.loadManifest.and.returnValue(of(remoteSettings));

      service.loadSettings().subscribe({
        next: (result) => {
          expect(result).toBe(true);

          // Should still have environment settings
          const settings = service.settings();
          expect(settings.api_url).toBe('http://env.com');
          expect(settings.production).toBe(false);

          done();
        },
        error: done.fail,
      });
    });
  });

  describe('settings signal', () => {
    it('should be reactive and update when loadSettings is called', (done) => {
      const remoteSettings: IAppSettings = {
        api_url: 'http://new.com',
        version: '3.0.0',
        production: true,
      };

      loaderSpy.loadManifest.and.returnValue(of(remoteSettings));

      // Get initial value
      const initialSettings = service.settings();
      expect(initialSettings).toEqual({} as IAppSettings);

      service.loadSettings().subscribe({
        next: () => {
          // Get updated value
          const updatedSettings = service.settings();
          expect(updatedSettings).not.toEqual(initialSettings);
          expect(updatedSettings.api_url).toBe('http://new.com');
          expect(updatedSettings.version).toBe('3.0.0');

          done();
        },
        error: done.fail,
      });
    });
  });
});
