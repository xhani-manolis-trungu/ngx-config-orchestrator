export interface IAuthSettings {
  authority: string;
  client_id: string;
  scope: string;
  response_type?: string;
  redirect_uri?: string;
  post_logout_redirect_uri?: string;
  silent_redirect_uri?: string;
  automaticSilentRenew?: boolean;
  monitorSession?: boolean;
  filterProtocolClaims?: boolean;
  loadUserInfo?: boolean;
  revokeAccessTokenOnSignout?: boolean;
  accessTokenExpiringNotificationTime?: number;
  [key: string]: any; 
}

export interface IAppSettings {
  api_url: string;
  version: string;
  production: boolean;
  auth_settings?: IAuthSettings;
  culture?: string;
  isServed?: boolean;
  isTemplate?: boolean;
  api_docs?: string;
  [key: string]: any;
}

export interface AppProvidersArray {
  dependencies?: any[];
  manifestUrl?: string;
  environment?: Partial<IAppSettings>;
}
