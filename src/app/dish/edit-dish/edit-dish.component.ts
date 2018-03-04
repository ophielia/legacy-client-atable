import {Component, OnInit} from "@angular/core";
import {ActivatedRoute, Router} from "@angular/router";
import {Dish} from "../../model/dish";
import {DishService} from "../../services/dish-service.service";
import {Tag} from "../../model/tag";
import TagType from "app/model/tag-type";
import {TagsService} from "../../services/tags.service";
import {TagDrilldown} from "app/model/tag-drilldown";

@Component({
  selector: 'at-edit-dish',
  templateUrl: './edit-dish.component.html',
  styleUrls: ['./edit-dish.component.css']
})
export class EditDishComponent implements OnInit {

  dishId: string;
  dish: Dish;
  dishName: string;
  dishTags: Tag[] = [];


  isEditDishName: boolean = false;
  selectedTags: Tag[] = [];
  browseAllDrilldowns: { [type: string]: TagDrilldown[] } = {};
  browseTagTypes: string[];
  expandFoldState: Map<string, boolean> = new Map<string, boolean>();
  private isTagEntry: boolean;
  private showBrowse: boolean = false;


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
  }

  getTagsForBrowse() {

    for (var i = 0; i < this.browseTagTypes.length; i++) {
      let ttype = this.browseTagTypes[i];
      // get / fill tag lists here from service
      this.tagService
        .getTagDrilldownList(ttype)
        .subscribe(p => {
          this.browseAllDrilldowns[ttype] = p
        });

      this.expandFoldState[ttype] = false;
    }


  }

  getDish(id: string) {
    this.dishService
      .getById(id)
      .subscribe(p => {
        this.dish = p;
        this.dishName = p.name;
        this.setDishTags(p.tags);
      });
  }

  showEditDishName() {
    this.isEditDishName = true;
  }

  setDishTags(tags: Tag[]) {
    let check = "";
    this.selectedTags.forEach(t => check = check + "!" + t.tag_id);
    this.dishTags = tags.filter(dt => !check.includes(dt.tag_id));
  }

  saveDishName() {
    this.dish.name = this.dishName;
    this.dishService.saveDish(this.dish)
      .subscribe(d => {
        this.getDish(this.dishId);
        this.isEditDishName = false;
      });

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
    this.dishService.addAndRemoveTags(this.dish, [], removeIds, false)
      .subscribe(f => this.getDish(this.dishId));
    this.selectedTags = [];
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
