import {Inject, Injectable} from "@angular/core";
import {AuthenticationService} from "./authentication.service";
import {Observable} from "rxjs/Observable";
import {MealPlan} from "../model/mealplan";
import MappingUtils from "app/model/mapping-utils";
import MealPlanType from "../model/meal-plan-type";
import {BaseHeadersService, myHeaders} from "./base-service";
import {APP_CONFIG, AppConfig} from "../app.config";
import {Logger} from "angular2-logger/core";
import {HttpClient, HttpResponse} from "@angular/common/http";
import {map} from "rxjs/operators";


@Injectable()
export class MealPlanService extends BaseHeadersService {

  private baseUrl: string;

  constructor(private httpClient: HttpClient,
              @Inject(APP_CONFIG) private config: AppConfig,
              private _logger: Logger,
              private _authenticationService: AuthenticationService) {
    super(_authenticationService);
    this.baseUrl = this.config.apiEndpoint + "mealplan";
  }

  getAll(): Observable<MealPlan[]> {
    let mealplans$ = this.httpClient
      .get(`${this.baseUrl}`)
      .map(data => this.mapMealPlansClient(data));
    return mealplans$;
  }

  getById(meal_plan_id: string) {
    let url = this.baseUrl + "/" + meal_plan_id;
    return this.httpClient.get(url).pipe(
      map(data => this.mapMealPlanClient(data)));
  }

  private mapMealPlansClient(object: Object): MealPlan[] {
    let embeddedObj = object["_embedded"];
    return embeddedObj["mealPlanResourceList"].map(MappingUtils.toMealPlan);
    //return new Array<MealPlan>();
    //return response.json()._embedded.mealPlanResourceList.map(MappingUtils.toMealPlan);
  }

  private mapMealPlanClient(object: Object): MealPlan {
    return MappingUtils.toMealPlan(object);
  }


  removeDishFromMealPlan(dish_id: string, meal_plan_id: string) {
    var url: string = this.baseUrl + '/' + meal_plan_id + "/dish/" + dish_id;

    return this
      .httpClient
      .delete(`${url}`);
  }

  addDishToMealPlan(dish_id: string, meal_plan_id: string) {
    var url: string = this.baseUrl + '/' + meal_plan_id + "/dish/" + dish_id;

    return this
      .httpClient
      .post(`${url}`, null);
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

  addMealPlan(mealPlanName: string): Observable<HttpResponse<Object>> {
    var newMealPlan: MealPlan = <MealPlan>({
      name: mealPlanName,
      meal_plan_type: MealPlanType.Manual
    });

    var url: string = this.baseUrl + '';


    return this
      .httpClient
      .post(`${url}`,
        JSON.stringify(newMealPlan),
        {headers: myHeaders, observe: 'response'});
  }

  deleteMealPlan(mealPlanId: string) {
    var url: string = this.baseUrl + '/' + mealPlanId;

    return this
      .httpClient
      .delete(`${url}`);
  }


  generateMealPlan(proposalId: string) {
    let url = this.baseUrl + "/proposal/"
      + proposalId;


    let proposal$ = this.httpClient
      .post(`${url}`,
        null,
        {headers: myHeaders, observe: 'response'});
    return proposal$;
  }

  renameMealPlan(meal_plan_id: string, mealPlanName: string) {
    // just filling in here
    let url = this.baseUrl + "/" + meal_plan_id + "/name/" + encodeURIComponent(mealPlanName);


    let mealplan$ = this.httpClient
      .post(`${url}`,
        null);
    return mealplan$;
  }
}


