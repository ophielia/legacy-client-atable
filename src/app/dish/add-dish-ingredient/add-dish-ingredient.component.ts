import {Component, OnInit} from '@angular/core';
import {TagDrilldown} from "../../model/tag-drilldown";
import {Dish} from "../../model/dish";
import {ITag, Tag} from "../../model/tag";
import {ActivatedRoute, Router} from "@angular/router";
import {DishService} from "../../services/dish-service.service";
import {TagsService} from "../../services/tags.service";
import {TagCommService} from "../../legacy/drilldown/tag-drilldown-select.service";
import TagType from "../../model/tag-type";

@Component({
  selector: 'at-add-dish-ingredient',
  templateUrl: './add-dish-ingredient.component.html',
  styleUrls: ['./add-dish-ingredient.component.css']
})
export class AddDishIngredientComponent implements OnInit {
  ingredientList: TagDrilldown[];

  dishId: string;
  dish: Dish;
  tagsToAdd: Tag[] = [];
  private tagSelectEvent: any;
  originalTags: Tag[];
  alltags: ITag[];

  constructor(private route: ActivatedRoute,
              private router: Router,
              private dishService: DishService,
              private tagService: TagsService,
              private tagCommService: TagCommService) {
    this.dishId = this.route.snapshot.params['id'];


  }

  ngOnInit() {
    this.route.params.subscribe(params => {
      let id = params['id'];
      console.log('getting dish with id: ', id);
      this.getDish(id);
      this.getIngredientTags();
    });
    this.tagSelectEvent = this.tagCommService.selectEvent
      .subscribe(selectevent => {
        this.addTagToDish(selectevent);
      })
    this.getAllTags();
  }


  getDish(id: string) {
    this.dishService
      .getById(id)
      .subscribe(p => {
        this.dish = p;
        this.pullIngredientTags();
      });
  }

  getAllTags() {
    this.tagService
      .getAllSelectable('Ingredient', 'Assign')
      .subscribe(p => {
        this.alltags = p;
      });

  }

  getIngredientTags() {
    this.tagService
      .getTagDrilldownList(TagType.Ingredient)
      .subscribe(l => this.ingredientList = l);
  }

  addTagToDish(tag: Tag) {
    let test = this.tagsToAdd.filter(t => tag.tag_id == t.tag_id);
    if (test.length > 0) {
      return;
    }
    this.tagsToAdd.push(tag);
  }

  removeFromSelected(tag: Tag) {
    this.tagsToAdd = this.tagsToAdd.filter(t => t.tag_id != tag.tag_id);
  }

  save(navpage) {
    let toAdd: string[] = [];
    for (var i = 0; i < this.tagsToAdd.length; i++) {
      let isoriginal = false;
      let test = this.originalTags.filter(t => t.tag_id == this.tagsToAdd[i].tag_id);
      if (test.length > 0) {
        // this is an original tag - we remove it from original tags and break
        this.originalTags = this.originalTags.filter(t => t.tag_id != this.tagsToAdd[i].tag_id);
        isoriginal = true;
      }
      if (!isoriginal) {
        toAdd.push(this.tagsToAdd[i].tag_id);
      }

    }
    let toRemove: string[] = this.originalTags.map(t => t.tag_id);
    this.dishService.addAndRemoveTags(this.dish, toAdd, toRemove, true).subscribe(
      (val) => console.log(val), t => this.router.navigate([navpage, this.dishId])
    );
  }

  goToNext() {
    this.save('/adddish/general/');

  }

  goToPrevious() {
    this.save('/adddish/ratings/');
    //this.router.navigate([, this.dishId]);

  }

  private pullIngredientTags() {
    this.originalTags = this.dish.tags.filter(t => t.tag_type == TagType.Ingredient);
    this.originalTags.forEach(t => this.tagsToAdd.push(t));
  }
}
