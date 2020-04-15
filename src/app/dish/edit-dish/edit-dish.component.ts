import {Component, OnDestroy, OnInit} from "@angular/core";
import {ActivatedRoute, Router} from "@angular/router";
import {Dish} from "../../model/dish";
import {DishService} from "../../services/dish-service.service";
import {ITag, Tag} from "../../model/tag";
import TagType from "app/model/tag-type";
import {TagsService} from "../../services/tags.service";
import {TagDrilldown} from "app/model/tag-drilldown";
import {Subscription} from "rxjs/Subscription";

@Component({
  selector: 'at-edit-dish',
  templateUrl: './edit-dish.component.html',
  styleUrls: ['./edit-dish.component.css']
})
export class EditDishComponent implements OnInit, OnDestroy {
  alltags: ITag[];

  dishId: string;
  dish: Dish;
  dishName: string;
  dishTags: Tag[] = [];

  unsubscribe: Subscription[] = [];
  isEditDishText: boolean = false;
  selectedTags: Tag[] = [];
  browseAllDrilldowns: { [type: string]: TagDrilldown[] } = {};
  browseTagTypes: string[];
  expandFoldState: Map<string, boolean> = new Map<string, boolean>();
  public isTagEntry: boolean;
  private showBrowse: boolean = false;
  dishReference: string;
  dishDescription: string;


  constructor(private route: ActivatedRoute,
              private tagService: TagsService,
              private router: Router,
              private dishService: DishService) {
    this.dishId = this.route.snapshot.params['id'];
    this.initializeBrowseTagTypes();
  }

  private initializeBrowseTagTypes() {
    this.browseTagTypes = [];
    this.browseTagTypes.push(TagType.DishType);
    this.browseTagTypes.push(TagType.Rating);
    this.browseTagTypes.push(TagType.TagType);
    this.browseTagTypes.push(TagType.Ingredient);
  }

  ngOnInit() {
    this.route.params.subscribe(params => {
      let id = params['id'];
      console.log('getting dish with id: ', id);
      this.getDish(id);
    });
    this.getTagsForBrowse();
    this.getAllTags();
  }

  ngOnDestroy(): void {
    this.unsubscribe.forEach(s => s.unsubscribe());
  }

  getTagsForBrowse() {

    for (var i = 0; i < this.browseTagTypes.length; i++) {
      let ttype = this.browseTagTypes[i];
      // get / fill tag lists here from service
      let sub$ = this.tagService
        .getTagDrilldownList(ttype)
        .subscribe(p => {
          this.browseAllDrilldowns[ttype] = p
        });
      this.unsubscribe.push(sub$);
      this.expandFoldState[ttype] = false;
    }


  }

  getAllTags() {
    this.tagService
      .getAllSelectable('Ingredient,Rating,DishType,TagType', 'Assign')
      .subscribe(p => {
        this.alltags = p;
      });

  }

  getDish(id: string) {
    let sub$ = this.dishService
      .getById(id)
      .subscribe(p => {
        this.dish = p;
        this.dishName = p.name;
        this.dishDescription = p.description;
        this.dishReference = p.reference;
        this.setDishTags(p.tags);
      });
    this.unsubscribe.push(sub$);
  }

  showEditDishName() {
    this.isEditDishText = true;
  }

  setDishTags(tags: Tag[]) {
    let check = "";
    this.selectedTags.forEach(t => check = check + "!" + t.tag_id);
    this.dishTags = tags.filter(dt => !check.includes(dt.tag_id));
  }

  saveDishName() {
    this.dish.name = this.dishName;
    this.saveDish();
  }


  saveDishReference() {
    this.dish.reference = this.dishReference;
    this.saveDish();
  }

  saveDishDescription() {
    this.dish.description = this.dishDescription;
    this.saveDish();
  }

  private saveDish() {
    let sub$ = this.dishService.saveDish(this.dish)
      .subscribe(d => {
        this.getDish(this.dishId);
        this.isEditDishText = false;
      });

    this.unsubscribe.push(sub$);
  }

  selectTag(tag: Tag) {
    let match = this.selectedTags.filter(t => t.tag_id == tag.tag_id);
    if (!match || match.length == 0) {
      this.selectedTags.push(tag);
      this.dishTags = this.dishTags.filter(t => t.tag_id != tag.tag_id);
    }
    match = [];
  }

  unselectTag(tag: Tag) {
    this.selectedTags = this.selectedTags.filter(t => t.tag_id != tag.tag_id);
    this.dish.tags.push(tag);
  }

  removeTagsFromDish() {
    let removeIds = this.selectedTags.map(t => t.tag_id);
    let sub$ = this.dishService.addAndRemoveTags(this.dish, [], removeIds, false)
      .subscribe(f => this.getDish(this.dishId));
    this.selectedTags = [];
    this.unsubscribe.push(sub$);
  }

  showTagEntry() {
    this.isTagEntry = true;
  }

  hideTagEntry() {
    this.isTagEntry = false;
  }

  toggleBrowse() {
    this.showBrowse = !this.showBrowse;
  }

  expandOrFoldBrowse(tagtype: string) {
    this.expandFoldState[tagtype] = !this.expandFoldState[tagtype];
  }

  isExpanded(tagtype: string) {
    return this.expandFoldState[tagtype];
  }

  addTagToDish(tag: Tag) {
    this.dishService.addTagToDish(this.dishId, tag.tag_id)
      .subscribe(t => this.getDish(this.dishId));
  }


  goToList(dish_id: string) {
    this.router.navigate(['managedishes']);
  }

}
