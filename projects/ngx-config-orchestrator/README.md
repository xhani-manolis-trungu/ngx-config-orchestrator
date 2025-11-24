# ngx-config-orchestrator

A robust Angular library for **Runtime Configuration**, created by **Xhani Manolis Trungu**.

## Installation
```bash
npm install ngx-config-orchestrator
```

## Usage
Add to `app.config.ts`:
```typescript
import { provideConfigOrchestrator } from 'ngx-config-orchestrator';

export const appConfig = {
  providers: [ provideConfigOrchestrator() ]
};
```
