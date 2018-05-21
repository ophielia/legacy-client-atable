import {ErrorHandler, Injectable, Injector} from "@angular/core";
import {HttpErrorResponse} from "@angular/common/http";
import {AlertService} from "../services/alert.service";

@Injectable()
export class MyErrorHandler implements ErrorHandler {
  private notificationService: AlertService;

  constructor(injector: Injector) {
    setTimeout(() => this.notificationService = injector.get(AlertService));
  }

  handleError(error: Response | HttpErrorResponse) {


    if (error instanceof HttpErrorResponse) {
      // Server or connection error happened
      if (!navigator.onLine) {
        // Handle offline error
        return this.notificationService.error('No Internet Connection');
      } else {
        // Handle Http Error (error.status === 403, 404...)
        var errorObject: Object = `${error.error}`;
        if (errorObject) {
          console.error('Server error!!: ', `${error.error.status} - ${error.error.message}`);

        } else {
          console.error('Server error!!: ', `${error.status} + ${error.message}`);

        }
        return this.notificationService.error("Oh no - something has gone wrong - desperately wrong....");
      }
    }
    // Log the error anyway
    console.error('It happens: ', error);
  }
}
