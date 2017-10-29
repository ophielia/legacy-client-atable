import {Injectable} from '@angular/core';
import {AuthenticationService} from "./authentication.service";
import {Http, Headers, Response} from "@angular/http";
import {Observable} from "rxjs/Observable";
import {MealPlan} from "./model/mealplan";
import MappingUtils from "app/mapping-utils";

@Injectable()
export class MealPlanService {

  private baseUrl = "http://localhost:8181";

  constructor(private http: Http,
              private authenticationService: AuthenticationService) {
  }

  private getHeaders() {
    // I included these headers because otherwise FireFox
    // will request text/html instead of application/json
    let headers = new Headers();
    headers.append('Accept', 'application/json');
    headers.append('Content-Type', 'application/json');
    headers.append('Authorization', 'Bearer ' + this.authenticationService.getToken());
    return headers;
  }

  getAll(): Observable<MealPlan[]> {
    let mealplans$ = this.http
      .get(`${this.baseUrl}/mealplan`, {headers: this.getHeaders()})
      .map(this.mapMealPlans).catch(handleError);
    return mealplans$;
  }

  private mapMealPlans(response: Response): MealPlan[] {
    return response.json()._embedded.mealPlanResourceList.map(MappingUtils.toMealPlan);
  }

  private mapMealPlan(response: Response): MealPlan {
    return MappingUtils.toMealPlan(response.json());
  }

}

function handleError(error: any) {
  // log error
  // could be something more sophisticated
  let errorMsg = error.message || `Yikes! There was a problem with our hyperdrive device and we couldn't retrieve your data!`
  console.error(errorMsg);

  // throw an application level error
  return Observable.throw(errorMsg);
}
