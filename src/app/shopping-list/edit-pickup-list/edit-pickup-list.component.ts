import {Component, OnInit, ViewChild} from '@angular/core';
import {IShoppingList, ShoppingList} from "../../model/shoppinglist";
import {IDish} from "../../model/dish";
import {ITag, Tag} from "../../model/tag";
import {ListLayout} from "../../model/listlayout";
import {Subscription} from "rxjs";
import {ActivatedRoute, Router} from "@angular/router";
import {ShoppingListService} from "../../services/shopping-list.service";
import {DishService} from "../../services/dish-service.service";
import {TagsService} from "../../services/tags.service";
import {TagCommService} from "../../legacy/drilldown/tag-drilldown-select.service";
import TagType from "../../model/tag-type";

@Component({
  selector: 'at-edit-pickup-list',
  templateUrl: './edit-pickup-list.component.html',
  styleUrls: ['./edit-pickup-list.component.css']
})
export class EditPickupListComponent implements OnInit {
  @ViewChild('modal1') input;
  private shoppingListId: any = ShoppingList;
  private allDishes: IDish[];
  private alltags: ITag[];

  private tagTypes: string;
  private tagSelectEvent: any;
  private shoppingList: IShoppingList;
  private listLayoutList: ListLayout[];
  private listLegend: Map<string, string>;

  private highlightDishId: string;

  private showAddDish: boolean;
  private showMenu: boolean = true;
  private showItemLegends: boolean = true;
  private unsubscribe: Subscription[] = [];
  errorMessage: any;
  private activeListExists: boolean = false;


  constructor(private route: ActivatedRoute,
              private router: Router,
              private shoppingListService: ShoppingListService,
              private dishService: DishService,
              private tagService: TagsService,
              private tagCommService: TagCommService) {
    this.shoppingListId = this.route.snapshot.params['id'];
    this.tagTypes = TagType.Ingredient + "," + TagType.NonEdible;

  }

  ngOnInit() {
    this.route.params.subscribe(params => {
      let id = params['id'];
      console.log('getting dish with id: ', id);
      this.getShoppingList(id);
    });

    this.tagSelectEvent = this.tagCommService.selectEvent
      .subscribe(selectevent => {
        this.addTagToList(selectevent);
      })
    this.getAllTags()
    this.getAllDishes();
  }

  ngOnDestroy(): void {
    this.unsubscribe.forEach(s => s.unsubscribe());
  }

  getShoppingList(id: string) {
    var $sub = this.shoppingListService
      .getByIdWithPantry(id, false)
      .subscribe(p => {
        this.shoppingList = p;
      });
    this.unsubscribe.push($sub);

    var $sub = this.shoppingListService
      .getById(id)
      .subscribe(t => {
        if (t) {
          this.activeListExists = true;
        }
      });
    this.unsubscribe.push($sub);
  }

  getAllTags() {
    this.tagService
      .getAllSelectable(this.tagTypes, 'Assign')
      .subscribe(p => {
          this.alltags = p;
        },
        e => this.errorMessage = e);

  }

  private addTagToList(tag: Tag) {
    // add tag to list as item in back end
    var $sub = this.shoppingListService.addTagItemToShoppingList(this.shoppingList.list_id, tag)
      .subscribe(p => {
        this.getShoppingList(this.shoppingList.list_id);
      });
    this.unsubscribe.push($sub);
  }

  addDishToList(dish: any) {
    this.listLegend = null;
    var $sub = this.shoppingListService.addDishToShoppingList(this.shoppingList.list_id, dish.dish_id)
      .subscribe(t => {
        this.highlightDishId = dish.dish_id;
        this.getShoppingList(this.shoppingList.list_id);
        this.showAddDish = false;
      });
    this.unsubscribe.push($sub);
  }

  getAllDishes() {
    this.dishService.getAll()
      .subscribe(p => {
          this.allDishes = p;
        },
        e => this.errorMessage = e);

  }

  clearList() {
    var $sub = this.shoppingListService.removeAllItemsFromList(this.shoppingList.list_id)
      .subscribe(r => {
        this.getShoppingList(this.shoppingList.list_id)
      });
    this.unsubscribe.push($sub);
    this.highlightDishId = null;
  }

  shopWithThisList() {

    // determine if modal should be shown
    if (this.activeListExists) {
      // show modal
      this.input.show();
    } else {
      // set list active directly
      this.setListActive(false);
    }


  }

  processModalSelection(modal_result: string) {
    console.log(modal_result + 'modal result');
    if (modal_result == 'replace') {
      console.log('replace');
      this.setListActive(true);
    } else {
      console.log('active');
      this.setListActive(false);
    }
  }

  setListActive(replaceList: boolean) {
    this.shoppingListService.setListActive(this.shoppingList.list_id, replaceList)
      .subscribe(r => {
        var headers = r.headers;
        var location = headers.get("Location");
        var splitlocation = location.split("/");
        var id = splitlocation[splitlocation.length - 1];
        this.shoppingListId = id;
        this.router.navigate(["list/shop/", id]);
      });
  }

  toggleMenu() {
    this.showMenu = !this.showMenu;
  }

  toggleAddDish() {
    this.showAddDish = !this.showAddDish;
  }
}
