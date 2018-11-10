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
import ListType from "../../model/list-type";
import {ITag} from "../../model/tag";
import {Slot} from "../../model/slot";


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
    this.selectedDishes.push(slot.dish);
    // remove dish from slot
    var filteredSlots = this.mealPlan.slots.filter((mp_slot: Slot) =>
      slot.slot_id != mp_slot.slot_id);
    var mealPlan = this.mealPlan;
    mealPlan.slots = filteredSlots;
    this.mealPlan = mealPlan;
  }

  unselectDish(dish) {
    var filteredDishes = this.selectedDishes.filter((d: Dish) =>
      dish.dish_id != d.dish_id);
    var slot = new Slot();
    slot.dish = dish;


    this.selectedDishes = filteredDishes;
    this.mealPlan.slots.push(slot);
  }

  removeDishFromMealPlan(dish) {
    var dishIds = this.selectedDishes.map(d => d.dish_id);

    this.mealPlanService
      .removeDishesFromMealPlan(dishIds, this.mealPlanId)
      .subscribe(p => {
        this.loadMealPlan();
        this.isEditMealPlanName = false;
      });

    this.selectedDishes = [];
  }

  generateListFromMealPlan(listProperties) {
    var dishIdList = this.selectedDishes.map(d => d.dish_id);
    this.shoppingListService.addShoppingListNew(null, this.mealPlanId, listProperties.add_from_base,
      listProperties.add_from_pickup, listProperties.generate_mealplan, ListType.General)
      .subscribe(r => {
        var headers = r.headers;
        var location = headers.get("Location");
        var splitlocation = location.split("/");
        var id = splitlocation[splitlocation.length - 1];
        this.goToShoppingListEdit(id);
      });
  }


  goToShoppingListEdit(list_id: string) {
    this.router.navigate(["list/edit/", list_id])
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
