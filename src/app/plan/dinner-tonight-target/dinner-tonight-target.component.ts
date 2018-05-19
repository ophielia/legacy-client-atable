import {Component, OnDestroy, OnInit} from "@angular/core";
import {TagsService} from "../../services/tags.service";
import {Subscription} from "rxjs/Subscription";
import {ITag, Tag} from "../../model/tag";
import TagSelectType from "../../model/tag-select-type";
import {Router} from "@angular/router";

@Component({
  selector: 'at-dinner-tonight-target',
  templateUrl: './dinner-tonight-target.component.html',
  styleUrls: ['./dinner-tonight-target.component.css']
})
export class DinnerTonightTargetComponent implements OnInit, OnDestroy {

  private selectedTags: ITag[] = [];
  private alltagsSearch: ITag[];
  unsubscribe: Subscription[] = [];

  constructor(private tagService: TagsService,
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
      .getAllSelectable('Rating,DishType,TagType', TagSelectType.Search)
      .subscribe(p => {
        this.alltagsSearch = p;
      });
    this.unsubscribe.push($sub);
  }

  goToNext() {
    // MM need to save the target here
    this.router.navigate(["plan/dinnertonight/result"]);
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
