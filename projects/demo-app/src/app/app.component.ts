import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ConfigurationService } from 'ngx-config-orchestrator';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div style="font-family: sans-serif; padding: 40px; max-width: 800px; margin: 0 auto;">
      <h1 style="color: #1976d2;">ngx-config-orchestrator</h1>
      <p>This app is consuming the library directly from the workspace.</p>
      
      <div *ngIf="config() as settings" style="background: #f5f5f5; padding: 20px; border-radius: 8px; border: 1px solid #ddd;">
        <h3 style="margin-top:0">✅ Configuration Loaded Successfully</h3>
        <hr>
        <p><strong>API URL:</strong> <span style="color:green">{{ settings.api_url }}</span></p>
        <p><strong>Auth Client ID:</strong> {{ settings.auth_settings?.client_id }}</p>
        <p><strong>Feature Flag:</strong> {{ settings['feature_flags']?.new_dashboard }}</p>
        
        <details>
          <summary style="cursor:pointer; color: #666;">View Full JSON</summary>
          <pre style="background: #333; color: #fff; padding: 10px; border-radius: 4px; margin-top: 10px;">{{ settings | json }}</pre>
        </details>
      </div>
    </div>
  `
})
export class AppComponent {
  private configService = inject(ConfigurationService);
  
  // Expose the signal directly to the template
  public config = this.configService.settings;
}
