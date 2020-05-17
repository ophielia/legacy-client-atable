import {Component, OnDestroy, OnInit} from "@angular/core";
import {Dish} from "../../model/dish";
import {IMealPlan} from "../../model/mealplan";
import {MealPlanService} from "../../services/meal-plan.service";
import {ShoppingListService} from "../../services/shopping-list.service";
import {ActivatedRoute, Router} from "@angular/router";
import {Subscription} from "rxjs/Subscription";
import {Slot} from "../../model/slot";
import {IShoppingList} from "../../model/shoppinglist";


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
  private listOfLists: IShoppingList[] = [];
  private starterListId: string;
  private isShowAddToList: boolean = false;


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
    this.getLists()
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
  toggleAddToList() {
    this.isShowAddToList = !this.isShowAddToList;
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
    this.shoppingListService.addShoppingList(null, this.mealPlanId, listProperties.add_from_starter, listProperties.add_from_pickup, listProperties.generate_mealplan)
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

  goToRateMealPlan(meal_plan_id: string) {
    this.router.navigate(['plan/rate', meal_plan_id]);
  }
  goToFillInMealPlan(meal_plan_id: string) {
    this.router.navigate(['plan/fillin', meal_plan_id]);
  }

  private getLists() {
    this.listOfLists = []
    var $sub = this.shoppingListService.getAll()
      .subscribe( lists => {
        for (let list of lists) {
          // don't include this list
          // check for starter, and fill in starter
          if (list.is_starter) {
            this.starterListId = list.list_id;
          }
          // add to list
          this.listOfLists.push(list);
        }



      });
    this.unsubscribe.push($sub);
  }


  addMealPlanToList(fromListId: string) {
    var $sub = this.shoppingListService.addMealPlanToShoppingList(fromListId, this.mealPlan.meal_plan_id)
      .subscribe(r => {
        this.router.navigate(['/list/edit/', fromListId]);
      });
    this.unsubscribe.push($sub);
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
