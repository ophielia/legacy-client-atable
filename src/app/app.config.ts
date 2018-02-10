import {NgModule, InjectionToken} from '@angular/core';

export let APP_CONFIG = new InjectionToken<AppConfig>('app.config');

// TODO: get rid of warnings by splitting interface out into separate file
// export interface AppConfig {
export class AppConfig {
  apiEndpoint: string;
}

export const APP_DI_CONFIG: AppConfig = {
  apiEndpoint: 'http://localhost:8000/api/v1'
};

@NgModule({
  providers: [{
    provide: APP_CONFIG,
    useValue: APP_DI_CONFIG
  }]
})
export class AppConfigModule {
}
