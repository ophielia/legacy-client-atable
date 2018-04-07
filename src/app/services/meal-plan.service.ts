import {Inject, Injectable} from "@angular/core";
import {AuthenticationService} from "./authentication.service";
import {Http, Response} from "@angular/http";
import {Observable} from "rxjs/Observable";
import {MealPlan} from "../model/mealplan";
import MappingUtils from "app/model/mapping-utils";
import MealPlanType from "../model/meal-plan-type";
import {BaseHeadersService} from "./base-service";
import {APP_CONFIG, AppConfig} from "../app.config";
import {Logger} from "angular2-logger/core";

@Injectable()
export class MealPlanService extends BaseHeadersService {

  private baseUrl: string;

  constructor(private http: Http,
              @Inject(APP_CONFIG) private config: AppConfig,
              private _logger: Logger,
              private _authenticationService: AuthenticationService) {
    super(_authenticationService);
    this.baseUrl = this.config.apiEndpoint + "mealplan";
  }

  getAll(): Observable<MealPlan[]> {
    let mealplans$ = this.http
      .get(`${this.baseUrl}`, {headers: this.getHeaders()})
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
      .get(`${this.baseUrl}/${meal_plan_id}`,
        {headers: this.getHeaders()})
      .map(this.mapMealPlan)
      .catch(handleError);
    return mealplan$;
  }

  removeDishFromMealPlan(dish_id: string, meal_plan_id: string) {
    var url: string = this.baseUrl + '/' + meal_plan_id + "/dish/" + dish_id;

    return this
      .http
      .delete(`${url}`,
        {headers: this.getHeaders()});
  }

  addDishToMealPlan(dish_id: string, meal_plan_id: string) {
    var url: string = this.baseUrl + '/' + meal_plan_id + "/dish/" + dish_id;

    return this
      .http
      .post(`${url}`, null,
        {headers: this.getHeaders()});
  }


  addDishesToMealPlan(dish_ids: string[], meal_plan_id: string) {
    // check if this will be a new mealplan (meal_plan_id empty or null)
    var mealPlan
    if (meal_plan_id == null || meal_plan_id.length == 0) {

    }

    var chain: any = this.addDishToMealPlan(dish_ids[0], meal_plan_id);

    if (dish_ids.length == 1) {
      return chain;
    }

    for (var i = 1; i < dish_ids.length; i++) {
      chain = chain.concat(this.addDishToMealPlan(dish_ids[i], meal_plan_id));
    }
    return chain;

  }

  addMealPlan(mealPlanName: string) {
    var newMealPlan: MealPlan = <MealPlan>({
      name: mealPlanName,
      meal_plan_type: MealPlanType.Manual
    });

    var url: string = this.baseUrl + '';

    return this
      .http
      .post(`${url}`,
        JSON.stringify(newMealPlan),
        {headers: this.getHeaders()});
  }

  deleteMealPlan(mealPlanId: string) {
    var url: string = this.baseUrl + '/' + mealPlanId;

    return this
      .http
      .delete(`${url}`, {headers: this.getHeaders()});
  }


  generateMealPlan(proposalId: string) {
    let url = this.baseUrl + "/proposal/"
      + proposalId;


    let proposal$ = this.http
      .post(`${url}`,
        null,
        {headers: this.getHeaders()});
    return proposal$;
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
