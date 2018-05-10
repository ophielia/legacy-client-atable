import {Component, OnDestroy, OnInit} from "@angular/core";
import {ITag} from "../../model/tag";
import {TagDrilldown} from "../../model/tag-drilldown";
import {IShoppingList} from "../../model/shoppinglist";
import {TagCommService} from "../../legacy/drilldown/tag-drilldown-select.service";
import TagType from "../../model/tag-type";
import {TagsService} from "../../services/tags.service";
import {ShoppingListService} from "../../services/shopping-list.service";
import ListType from "../../model/list-type";
import {Subscription} from "rxjs/Subscription";
import TagSelectType from "../../model/tag-select-type";

@Component({
  selector: 'at-quick-pick-up-list',
  templateUrl: './quick-pick-up-list.component.html',
  styleUrls: ['./quick-pick-up-list.component.css']
})
export class QuickPickUpListComponent implements OnInit, OnDestroy {

  pickUpListId: string = null;
  browseTagTypes: string[];
  browseAllDrilldowns: { [type: string]: TagDrilldown[] } = {};
  alltagsSearch: ITag[];
  shoppingList: IShoppingList;

  tagSelectEvent: any;

  expandFoldState: Map<string, boolean> = new Map<string, boolean>();

  unsubscribe: Subscription[] = [];
  private showTagBrowse: boolean;

  constructor(private tagCommService: TagCommService,
              private shoppingListService: ShoppingListService,
              private tagService: TagsService,) {
    this.initializeBrowseTagTypes();
  }

  private initializeBrowseTagTypes() {
    this.browseTagTypes = [];
    this.browseTagTypes.push(TagType.NonEdible);
    this.browseTagTypes.push(TagType.Ingredient);
  }

  ngOnInit() {

    this.tagSelectEvent = this.tagCommService.selectEvent
      .subscribe(selectevent => {
        this.addTagToList(selectevent);
      })
    this.getPickUpList();
    this.getBrowseTags();
    this.getDropdownTags();
  }

  ngOnDestroy() {
    this.tagSelectEvent.unsubscribe();
    this.unsubscribe.forEach(s => s.unsubscribe());
  }

  private getBrowseTags() {
    for (var i = 0; i < this.browseTagTypes.length; i++) {
      let ttype = this.browseTagTypes[i];
      // get / fill tag lists here from service
      let $sub = this.tagService
        .getTagDrilldownList(ttype).subscribe(p => {
          this.browseAllDrilldowns[ttype] = p
        });
      this.unsubscribe.push($sub);

      this.expandFoldState[ttype] = false;

    }
  }

  private getPickUpList() {
    if (this.pickUpListId) {
      this.refreshList();
    }
    this.shoppingListService.getByType(ListType.PickUpList)
      .subscribe(r => {
        if (r) {
          this.pickUpListId = r.list_id;
          this.shoppingList = r;
        } else {
          this.shoppingListService.addShoppingListNew(null, null, false, false, false, ListType.PickUpList)
            .subscribe(r => {
                var headers = r.headers;
                var location = headers.get("Location");
                var splitlocation = location.split("/");
                this.pickUpListId = splitlocation[splitlocation.length - 1];
                this.refreshList();
              }
            )
        }
      })
  }

  private refreshList() {
    this.shoppingListService.getById(this.pickUpListId)
      .subscribe(l => this.shoppingList = l);
  }

  private getDropdownTags() {
    this.tagService
      .getAllSelectable('Ingredient,NonEdible', TagSelectType.Assign)
      .subscribe(p => {
        this.alltagsSearch = p;
      });

  }

  removeItemFromList(item_id: string) {

  }


  addTagToList(tag: ITag) {
    this.showTagBrowse = false;
    // add tag to list as item in back end
    var $sub = this.shoppingListService.addTagItemToShoppingList(this.shoppingList.list_id, tag)
      .subscribe(p => {
        this.refreshList();
      });
    this.unsubscribe.push($sub);
  }

  toggleBrowse() {
    this.showTagBrowse = !this.showTagBrowse;
  }


}
