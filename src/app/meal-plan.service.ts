import {Injectable} from '@angular/core';
import {AuthenticationService} from "./authentication.service";
import {Http, Headers, Response} from "@angular/http";
import {Observable} from "rxjs/Observable";
import {MealPlan} from "./model/mealplan";
import MappingUtils from "app/mapping-utils";
import MealPlanType from "./model/meal-plan-type";

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
    headers.append('Access-Control-Allow-Origin', '*');
    headers.append('Access-Control-Expose-Headers', 'Location');
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

  getById(meal_plan_id: any) {
    let mealplan$ = this.http
      .get(`${this.baseUrl}/mealplan/${meal_plan_id}`,
        {headers: this.getHeaders()})
      .map(this.mapMealPlan)
      .catch(handleError);
    return mealplan$;
  }

  removeDishFromMealPlan(dish_id: string, meal_plan_id: string) {
    var url: string = this.baseUrl + '/mealplan/' + meal_plan_id + "/dish/" + dish_id;

    return this
      .http
      .delete(`${url}`,
        {headers: this.getHeaders()});
  }

  addDishToMealPlan(dish_id: string, meal_plan_id: string) {
    var url: string = this.baseUrl + '/mealplan/' + meal_plan_id + "/dish/" + dish_id;

    return this
      .http
      .post(`${url}`, null,
        {headers: this.getHeaders()});
  }

  addMealPlan(mealPlanName: string) {
    var newMealPlan: MealPlan = <MealPlan>({
      name: mealPlanName,
      meal_plan_type: MealPlanType.Manual
    });

    var url: string = this.baseUrl + '/mealplan';

    return this
      .http
      .post(`${url}`,
        JSON.stringify(newMealPlan),
        {headers: this.getHeaders()});
  }

  deleteMealPlan(mealPlanId: string) {
    var url: string = this.baseUrl + '/mealplan/' + mealPlanId;

    return this
      .http
      .delete(`${url}`, {headers: this.getHeaders()});
  }

  generateShoppingList(meal_plan_id: string) {
    var url: string = this.baseUrl + '/shoppinglist/mealplan/' + meal_plan_id;
    return this
      .http
      .post(`${url}`,
        null,
        {headers: this.getHeaders()});
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
