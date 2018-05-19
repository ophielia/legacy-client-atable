import {Component, OnDestroy, OnInit} from "@angular/core";
import {TagsService} from "../../services/tags.service";
import {Subscription} from "rxjs/Subscription";
import {ITag, Tag} from "../../model/tag";
import TagSelectType from "../../model/tag-select-type";
import {ActivatedRoute, Router} from "@angular/router";
import {MealPlanService} from "../../services/meal-plan.service";

@Component({
  selector: 'at-dinner-tonight-on-hand',
  templateUrl: './dinner-tonight-on-hand.component.html',
  styleUrls: ['./dinner-tonight-on-hand.component.css']
})
export class DinnerTonightOnHandComponent implements OnInit, OnDestroy {

  private selectedTags: ITag[] = [];
  private alltagsSearch: ITag[];
  unsubscribe: Subscription[] = [];

  constructor(private tagService: TagsService,
              private mealPlanService: MealPlanService,
              private route: ActivatedRoute,
              private router: Router) {
  }

  ngOnInit() {
    this.getSearchTags();

  }

  ngOnDestroy() {
    this.unsubscribe.forEach(s => s.unsubscribe());
  }


  getSearchTags() {
    var $sub = this.tagService
      .getAllSelectable('Ingredient', TagSelectType.Assign)
      .subscribe(p => {
        this.alltagsSearch = p;
      });
    this.unsubscribe.push($sub);
  }

  goToNext() {
    // MM need to save the target here
    this.router.navigate(["plan/dinnertonight/two"]);
    //this.router.navigate(["plan/dinnertonight/two", target_id]);

  }

  selectTag(tag: Tag) {
    let match = this.selectedTags.filter(t => t.tag_id == tag.tag_id);
    if (match && match.length > 0) {
      return;
    }
    this.selectedTags.push(tag);
  }

  removeTag(tag: Tag) {
    this.selectedTags = this.selectedTags.filter(t => t.tag_id != tag.tag_id);
  }

  hasSelectedTags() {
    return (this.selectedTags && this.selectedTags.length > 0);
  }

}
