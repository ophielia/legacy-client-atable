import {BrowserModule} from "@angular/platform-browser";
import {ErrorHandler, NgModule} from "@angular/core";
import {FormsModule} from "@angular/forms";
import {HTTP_INTERCEPTORS, HttpClientModule} from "@angular/common/http";
import {LoggerModule, NgxLoggerLevel} from 'ngx-logger';
import {AppComponent} from "./app.component";
import {routing} from "./app.routes";
import {LegacyModule} from "app/legacy/legacy.module";
import {AppCommonModule} from "./app-common/app-common.module";
import {NavigationComponent} from "./navigation/navigation.component";
import {DashboardModule} from "./dashboard/dashboard.module";
import {AddDishCreateComponent} from "./dish/add-dish-create/add-dish-create.component";
import {DashboardManageDishesComponent} from "./dashboard/dashboard-manage-dishes/dashboard-manage-dishes.component";
import {AlertComponent} from "./app-common/alert/alert.component";
import {AlertService} from "./services/alert.service";
import {MyErrorHandler} from "./handlers/my-error-handler";

import {MyTokenInterceptor} from "./handlers/my-token-interceptor";
import {BrowserAnimationsModule} from "@angular/platform-browser/animations";


@NgModule({
  declarations: [
    AppComponent,
    NavigationComponent,
    AddDishCreateComponent,
    AlertComponent,
    DashboardManageDishesComponent
  ],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    FormsModule,
    HttpClientModule,
    routing,
    LegacyModule,
    AppCommonModule,
    DashboardModule,
    LoggerModule.forRoot({
      serverLoggingUrl: '/api/logs',
      level: NgxLoggerLevel.DEBUG,
      serverLogLevel: NgxLoggerLevel.ERROR
    })
  ],
  providers: [
    // include alert service in app module providers
    AlertService,
    {provide: ErrorHandler, useClass: MyErrorHandler},
    {provide: HTTP_INTERCEPTORS, useClass: MyTokenInterceptor, multi: true}
  ],
  bootstrap: [AppComponent]
})
export class AppModule {
}
