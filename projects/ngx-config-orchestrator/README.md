# ngx-config-orchestrator

**ngx-config-orchestrator** is a robust, lightweight Angular library designed to solve the problem of **Runtime Configuration**.

Unlike standard Angular environment files (which are baked into the build), this library allows your application to load settings from an external JSON file (e.g., `app-settings.manifest.json`) **before** the app starts. This enables "Build Once, Deploy Anywhere" workflows.

## 🚀 Key Features

- **Runtime Loading**: Change API URLs, feature flags, or OIDC settings without rebuilding.

- **Environment Merging**: Seamlessly overlays remote settings on top of your local `environment.ts` defaults.

- **Reactive State**: Access configuration via modern **Angular Signals**.

- **Type Safe**: Strongly typed interfaces for App and Auth settings.

- **SSR Compatible**: Built-in safeguards for Server-Side Rendering (Angular Universal).

- **Dependency Orchestration**: Initialize other services (like Logging or Analytics) only _after_ configuration is loaded.

## 📦 Installation

```bash
npm install ngx-config-orchestrator

```

## 🛠️ Quick Start

### 1\. Create the Manifest

Create a JSON file in your assets folder (`src/assets/app-settings.manifest.json`). This file will hold your runtime settings.

```javascript
{
  "api_url": "[https://api.production.com/v1](https://api.production.com/v1)",
  "production": true,
  "feature_flags": {
    "new_dashboard": true
  }
}

```

### 2\. Register the Provider

In your `app.config.ts` (for Angular Standalone applications), register the provider. You can optionally pass your local environment to provide fallback values.

```typescript
import { ApplicationConfig } from "@angular/core";
import { provideHttpClient } from "@angular/common/http";
import { provideConfigOrchestrator } from "ngx-config-orchestrator";
import { environment } from "./environments/environment";

export const appConfig: ApplicationConfig = {
  providers: [
    provideHttpClient(), // Required for HTTP requests
    provideConfigOrchestrator({
      environment: environment, // Merge with local environment
      manifestUrl: "./assets/app-settings.manifest.json", // Path to your JSON
    }),
  ],
};
```

## 📖 Usage & Examples

### Use Case 1: Accessing Configuration (Reactive Signal)

The recommended way to read settings is using the `ConfigurationService`. The `settings` property is an Angular Signal, meaning templates update automatically if config changes.

```typescript
import { Component, inject, ChangeDetectionStrategy } from "@angular/core";
import { JsonPipe } from "@angular/common";
import { ConfigurationService } from "ngx-config-orchestrator";

@Component({
  standalone: true,
  imports: [JsonPipe],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    @if (config(); as settings) {
    <h1>Welcome to {{ settings.app_title }}</h1>
    <p>API: {{ settings.api_url }}</p>
    }
  `,
})
export class AppComponent {
  // Expose signal to template
  public readonly config = inject(ConfigurationService).settings;
}
```

### Use Case 2: Authentication Settings (OIDC)

The library automatically extracts an `auth_settings` object from your JSON and exposes it via a specific token. This is perfect for configuring libraries like `angular-auth-oidc-client`.

**JSON:**

```json
{
  "auth_settings": {
    "authority": "https://identity.myapp.com",
    "client_id": "spa-client",
    "scope": "openid profile email"
  }
}
```

**Code:**

```typescript
import { Injectable, inject } from "@angular/core";
import { IAUTH_SETTINGS } from "ngx-config-orchestrator";

@Injectable({ providedIn: "root" })
export class AuthService {
  private readonly authConfig = inject(IAUTH_SETTINGS);

  constructor() {
    console.log("Authority URL:", this.authConfig.authority);
  }
}
```

### Use Case 3: Environment Merging

You can define default values in your `environment.ts` and override them only when needed via the JSON file.

**environment.ts:**

```typescript
export const environment = {
  production: false,
  theme: "blue", // Default
  api_url: "http://localhost:3000", // Default
};
```

**app-settings.manifest.json:**

```json
{
  "api_url": "https://api.staging.com"
}
```

**Result:** The final configuration will have `theme: 'blue'` (from env) and `api_url: 'https://api.staging.com'` (from JSON).

### Use Case 4: Runtime Dependencies

Sometimes you need to initialize a service (like ApplicationInsights or a Logger) only _after_ the configuration has loaded because you need a key from the config.

```typescript
import { APP_INITIALIZER, inject } from "@angular/core";
import { provideConfigOrchestrator, ConfigurationService } from "ngx-config-orchestrator";

function initAnalytics() {
  const configService = inject(ConfigurationService);
  const analytics = inject(AnalyticsService);

  return () => {
    const key = configService.settings().analytics_key;
    analytics.initialize(key);
  };
}

export const appConfig: ApplicationConfig = {
  providers: [
    provideConfigOrchestrator({
      // These providers run strictly AFTER config is loaded
      dependencies: [
        {
          provide: APP_INITIALIZER,
          useFactory: initAnalytics,
          multi: true,
        },
      ],
    }),
  ],
};
```
