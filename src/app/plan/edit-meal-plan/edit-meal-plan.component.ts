import {Component, OnDestroy, OnInit} from "@angular/core";
import {TagCommService} from "../../legacy/drilldown/tag-drilldown-select.service";
import {Dish} from "../../model/dish";
import {IMealPlan} from "../../model/mealplan";
import {MealPlanService} from "../../services/meal-plan.service";
import {DishService} from "../../services/dish-service.service";
import {ShoppingListService} from "../../services/shopping-list.service";
import {ActivatedRoute, Router} from "@angular/router";
import {Subscription} from "rxjs/Subscription";
import {AlertService} from "app/services/alert.service";


@Component({
  selector: 'at-edit-meal-plan',
  templateUrl: './edit-meal-plan.component.html',
  styleUrls: ['./edit-meal-plan.component.css']
})
export class EditMealPlanComponent implements OnInit, OnDestroy {
  isShowGenerateList: boolean = false;

  selectedDishes: Dish[] = [];
  mealPlanName: string = "";
  isEditMealPlanName: boolean = false;
  mealPlan: IMealPlan;
  sub: any;
  unsubscribe: Subscription[] = [];
  private mealPlanId: string;


  constructor(private mealPlanService: MealPlanService,
              private shoppingListService: ShoppingListService,
              private route: ActivatedRoute,
              private router: Router,) {

  }

  ngOnInit() {
    var $sub = this.route.params.subscribe(params => {
      let id = params['id'];
      console.log('getting mealPlan with id: ', id);
      this.mealPlanId = id;
      this.loadMealPlan();
    });
    this.unsubscribe.push($sub);
  }

  ngOnDestroy() {
    this.unsubscribe.forEach(s => s.unsubscribe());
  }

  loadMealPlan() {
    var $sub = this.mealPlanService
      .getById(this.mealPlanId)
      .subscribe(p => {
        this.mealPlan = p;
      });
    this.unsubscribe.push($sub);
  }

  toggleEditMealPlanName() {
    this.isEditMealPlanName = !this.isEditMealPlanName;
  }

  toggleGenerateList() {
    this.isShowGenerateList = !this.isShowGenerateList;
  }

  saveMealPlanName() {
    this.mealPlanService.renameMealPlan(this.mealPlan.meal_plan_id, this.mealPlanName)
      .subscribe(
        p => {
          this.loadMealPlan();
          this.isEditMealPlanName = false;
        }
      );

  }


  selectSlot(slot) {
    // MM implement this
  }

  unselectDish(dish) {
    // MM implement this
  }

  removeDishFromMealPlan(dish) {
    // MM implement this
  }

  generateListFromMealPlan(properties) {
    // MM implement this
  }

  goToPlanList(dish_id: string) {
    this.router.navigate(['plan/manage']);
  }

  goToAddToMealPlan(meal_plan_id: string) {
    this.router.navigate(['plan/add', meal_plan_id]);
  }

  goToFillInMealPlan(meal_plan_id: string) {
    this.router.navigate(['plan/fillin', meal_plan_id]);
  }


  generateShoppingList() {
    this.shoppingListService.generateShoppingList(this.mealPlan.meal_plan_id)
      .subscribe(r => {
        var headers = r.headers;
        var location = headers.get("Location");
        var splitlocation = location.split("/");
        var id = splitlocation[splitlocation.length - 1];
        //    this.getAllDishes();
        this.router.navigate(['/list/edit/', id]);
      });
  }


}
