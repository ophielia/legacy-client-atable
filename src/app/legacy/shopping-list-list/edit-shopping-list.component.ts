import {Component, EventEmitter, OnDestroy, OnInit, Output} from "@angular/core";
import {ShoppingListService} from "../../services/shopping-list.service";
import {ActivatedRoute, Router} from "@angular/router";
import {ShoppingList} from "../../model/shoppinglist";
import {TagCommService} from "../drilldown/tag-drilldown-select.service";
import {Tag} from "../../model/tag";
import {Item} from "../../model/item";
import TagSelectType from "../../model/tag-select-type";

@Component({
  selector: 'at-edit-shopping-list',
  templateUrl: './edit-shopping-list.component.html',
  styleUrls: ['./edit-shopping-list.component.css']
})
export class EditShoppingListComponent implements OnInit, OnDestroy {
  private shoppingListId: string;
  private subGetId: any;
  private subTagEvent: any;
  shoppingList: ShoppingList = <ShoppingList>{list_id: "", list_type: ""};
  private tagCommService: TagCommService;
  selectType: string = TagSelectType.Assign;
  @Output() tagEvent: EventEmitter<Tag> = new EventEmitter<Tag>();


  constructor(private shoppingListService: ShoppingListService,
              tagCommService: TagCommService,
              private route: ActivatedRoute,
              private router: Router,) {
    this.shoppingListId = this.route.snapshot.params['id'];
    this.tagCommService = tagCommService;
  }

  ngOnInit() {
    this.subGetId = this.route.params.subscribe(params => {
      let id = params['id'];
      console.log('getting dish with id: ', id);
      this.refreshList(id);
    });
    this.subTagEvent = this.tagCommService.selectEvent
      .subscribe(selectevent => {
        this.addItem(selectevent);
      });
  }

  ngOnDestroy() {
    this.subTagEvent.unsubscribe();
    this.subGetId.unsubscribe();
  }


  addItem(tag: Tag) {
    // add tag to list as item in back end
    this.shoppingListService.addTagItemToShoppingList(this.shoppingListId, tag)
      .subscribe(p => {
        this.refreshList(this.shoppingListId);
      });
    return false;

  }

  generateActiveList() {
    this.shoppingListService.setListActive(this.shoppingListId)
      .subscribe(r => {
        var headers = r.headers;
        var location = headers.get("Location");
        var splitlocation = location.split("/");
        var id = splitlocation[splitlocation.length - 1];
        this.shoppingListId = id;
        this.refreshList(id);
      });
  }

  removeItem(categoryname: string, item: Item) {

    // remove Item from shopping list
    this.shoppingListService.removeItemFromShoppingList(this.shoppingListId, item.item_id)
      .subscribe(t => this.refreshList(this.shoppingListId));
    return false;
  }


  refreshList(id: string) {
    this.shoppingListService
      .getById(id)
      .subscribe(p => this.shoppingList = p);
  }
}
