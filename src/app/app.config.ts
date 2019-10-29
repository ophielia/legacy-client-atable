import {NgModule, InjectionToken} from '@angular/core';

export let APP_CONFIG = new InjectionToken<AppConfig>('app.config');

export class AppConfig {
  apiEndpoint: string;
  defaultRatingPower: number;
  defaultShoppingListName: string;
}

export const APP_DI_CONFIG: AppConfig = {
  apiEndpoint: 'http://localhost:8182/v1/',
  defaultRatingPower: 3,
  defaultShoppingListName: "Shopping List"
};


@NgModule({
  providers: [{
    provide: APP_CONFIG,
    useValue: APP_DI_CONFIG
  }]
})
export class AppConfigModule {
}
