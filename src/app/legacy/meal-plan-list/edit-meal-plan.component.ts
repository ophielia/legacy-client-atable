import {Component, OnDestroy, OnInit} from "@angular/core";
import {MealPlan} from "../../model/mealplan";
import {ActivatedRoute, Router} from "@angular/router";
import {MealPlanService} from "../../services/meal-plan.service";
import {Dish} from "../../model/dish";
import {Slot} from "../../model/slot";
import {DishService} from "../../services/dish-service.service";
import {TagCommService} from "../drilldown/tag-drilldown-select.service";
import {Tag} from "../../model/tag";
import TagSelectType from "../../model/tag-select-type";

@Component({
  selector: 'at-edit-meal-plan',
  templateUrl: './edit-meal-plan.component.html',
  styleUrls: ['./edit-meal-plan.component.css'],
  styles: [`
    .inverted {
      color: red;
    }

    .notinverted {
      color: dimgrey;
    }
  `
  ]
})
export class EditMealPlanComponent implements OnInit, OnDestroy {
  filterTags: Tag[];
  subTagEvent: any;
  tagCommService: TagCommService;
  mealPlanDishIds: string[];
  invertTagIds: string[];
  dishList: Dish[];
  mealPlanId: string;
  name: string;
  showFilter: boolean = true;
  selectType: string = TagSelectType.Search;

  mealPlan: MealPlan = <MealPlan>{meal_plan_id: "", name: ""};
  sub: any;
  private errorMessage: string;


  constructor(private mealPlanService: MealPlanService,
              private dishService: DishService,
              tagCommService: TagCommService,
              private route: ActivatedRoute,
              private router: Router,) {
    this.mealPlanId = this.route.snapshot.params['id'];
    this.tagCommService = tagCommService;
    this.dishList = [];
    this.mealPlanDishIds = [];
  }

  ngOnInit() {
    this.sub = this.route.params.subscribe(params => {
      let id = params['id'];
      console.log('getting mealPlan with id: ', id);
      this.mealPlanService
        .getById(id)
        .subscribe(p => this.mealPlan = p);
    });
    this.subTagEvent = this.tagCommService.selectEvent
      .subscribe(selectevent => {
        this.addTagToFilter(selectevent);
      })
    this.getAllDishes();
    this.filterTags = [];
  }

  ngOnDestroy() {
    this.sub.unsubscribe();
  }

  getAllDishes() {
    if (!this.filterTags || this.filterTags.length == 0) {
      this.dishService
        .getAll()
        .subscribe(p => this.dishList = p,
          e => this.errorMessage = e);
    } else {
      var includeTagList = this.filterTags.filter(t => t.is_inverted == false).map(t => t.tag_id);
      var excludeTagList = this.filterTags.filter(t => t.is_inverted == true).map(t => t.tag_id);
      this.dishService
        .findByTags(includeTagList, excludeTagList)
        .subscribe(p => this.filterOutMealPlanDishes(p),
          e => this.errorMessage = e);
    }
  }

  private filterOutMealPlanDishes(dishlist: Dish[]) {
    this.dishList = dishlist.filter(t => !(this.mealPlanDishIds.indexOf(t.dish_id) > -1));
  }

  addDish(dish: Dish) {
    // add dish to mealPlan
    var dishExists = this.mealPlan.slots.filter(t => t.dish.dish_id == dish.dish_id);
    if (dishExists.length > 0) {
      // dish in mealplan - don't add again
      return;
    }
    // add dish in back end
    var slots = this.mealPlan.slots.slice(0);
    var slot: Slot = <Slot>{slot_id: "", dish: dish};
    slots.push(slot);
    this.mealPlan.slots = slots;
    // add dish id to list
    this.mealPlanDishIds.push(dish.dish_id);
    this.mealPlanService.addDishToMealPlan(dish.dish_id, this.mealPlan.meal_plan_id)
      .subscribe();
    return false;
  }

  generateShoppingList() {
    this.mealPlanService.generateShoppingList(this.mealPlan.meal_plan_id)
      .subscribe(r => {
        var headers = r.headers;
        var location = headers.get("Location");
        var splitlocation = location.split("/");
        var id = splitlocation[splitlocation.length - 1];
        //    this.getAllDishes();
        this.router.navigate(['/shoppinglist/edit/', id]);
      });
  }

  goToList() {
    this.router.navigate(['/mealplan/list']);
  }

  deleteDish(dish: Dish) {
    // remove dish from mealplan
    this.mealPlan.slots = this.mealPlan.slots.filter(t => t.dish.dish_id != dish.dish_id);
    // remove tag from backend
    this.mealPlanService.removeDishFromMealPlan(dish.dish_id, this.mealPlan.meal_plan_id)
      .subscribe();
    return false;
  }

  toggleFilter() {
    this.showFilter = !this.showFilter;
  }

  addTagToFilter(tag: Tag) {
    tag.is_inverted = false;
    this.filterTags.push(tag);
    this.getAllDishes();
  }

  removeTagFromFilter(tag: Tag) {
    this.filterTags = this.filterTags.filter(t => t.tag_id != tag.tag_id);
    this.getAllDishes();
  }


  toggleInvert(tag: Tag) {
    for (var i: number = 0; i < this.filterTags.length; i++) {
      if (this.filterTags[i].tag_id == tag.tag_id) {
        this.filterTags[i].is_inverted = !this.filterTags[i].is_inverted;
      }
    }
    this.getAllDishes();
  }
}
