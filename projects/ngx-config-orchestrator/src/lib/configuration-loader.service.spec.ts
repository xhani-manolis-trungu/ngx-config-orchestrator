import { HttpBackend, HttpClient } from '@angular/common/http';
import {
  ɵPLATFORM_BROWSER_ID as PLATFORM_BROWSER_ID,
  ɵPLATFORM_SERVER_ID as PLATFORM_SERVER_ID,
} from '@angular/common';
import { of, throwError } from 'rxjs';
import { ConfigurationLoader } from './configuration-loader.service';
import { IAppSettings } from './types';

describe('ConfigurationLoader', () => {
  let service: ConfigurationLoader;
  let httpClientSpy: jasmine.SpyObj<HttpClient>;
  let httpBackendSpy: jasmine.SpyObj<HttpBackend>;
  const mockManifestUrl = '/assets/config.json';

  describe('Browser Environment', () => {
    beforeEach(() => {
      // Create spy for HttpClient
      httpClientSpy = jasmine.createSpyObj('HttpClient', ['get']);

      // Create spy for HttpBackend that returns our HttpClient spy
      httpBackendSpy = jasmine.createSpyObj('HttpBackend', ['handle']);

      // Create service instance with mocked dependencies
      service = new ConfigurationLoader(
        httpBackendSpy,
        PLATFORM_BROWSER_ID as any,
        mockManifestUrl
      );

      // Replace the internal HttpClient with our spy
      (service as any).http = httpClientSpy;
    });

    it('should be created', () => {
      expect(service).toBeTruthy();
    });

    it('should load manifest from URL in browser environment', (done) => {
      const mockData: IAppSettings = {
        api_url: 'http://test.com',
        version: '1.0.0',
        production: false,
      };

      // Setup spy to return mock data
      httpClientSpy.get.and.returnValue(of(mockData));

      service.loadManifest().subscribe({
        next: (data) => {
          expect(data).toEqual(mockData);
          expect(httpClientSpy.get).toHaveBeenCalledWith(mockManifestUrl);
          done();
        },
        error: done.fail,
      });
    });

    it('should handle HTTP errors gracefully', (done) => {
      const errorResponse = { status: 500, statusText: 'Server Error' };

      // Setup spy to return error
      httpClientSpy.get.and.returnValue(throwError(() => errorResponse));

      service.loadManifest().subscribe({
        next: () => done.fail('should have failed'),
        error: (error) => {
          expect(error.status).toBe(500);
          expect(httpClientSpy.get).toHaveBeenCalledWith(mockManifestUrl);
          done();
        },
      });
    });

    it('should handle empty response', (done) => {
      const emptyData = {} as IAppSettings;

      // Setup spy to return empty data
      httpClientSpy.get.and.returnValue(of(emptyData));

      service.loadManifest().subscribe({
        next: (data) => {
          expect(data).toEqual(emptyData);
          expect(httpClientSpy.get).toHaveBeenCalledWith(mockManifestUrl);
          done();
        },
        error: done.fail,
      });
    });
  });

  describe('Server Environment (SSR)', () => {
    beforeEach(() => {
      // Create spy for HttpClient (won't be used in SSR)
      httpClientSpy = jasmine.createSpyObj('HttpClient', ['get']);

      // Create spy for HttpBackend
      httpBackendSpy = jasmine.createSpyObj('HttpBackend', ['handle']);

      // Create service instance with server platformId
      service = new ConfigurationLoader(
        httpBackendSpy,
        PLATFORM_SERVER_ID as any,
        mockManifestUrl
      );

      // Replace the internal HttpClient with our spy
      (service as any).http = httpClientSpy;
    });

    it('should return empty object without making HTTP call in server environment', (done) => {
      service.loadManifest().subscribe({
        next: (data) => {
          expect(data).toEqual({} as IAppSettings);
          // Verify HTTP client was NOT called
          expect(httpClientSpy.get).not.toHaveBeenCalled();
          done();
        },
        error: done.fail,
      });
    });

    it('should complete synchronously in server environment', (done) => {
      let completed = false;

      service.loadManifest().subscribe({
        next: (data) => {
          expect(data).toEqual({} as IAppSettings);
          completed = true;
        },
        complete: () => {
          expect(completed).toBe(true);
          done();
        },
      });
    });
  });
});
