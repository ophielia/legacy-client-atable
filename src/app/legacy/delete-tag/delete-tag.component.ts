import {Component, OnDestroy, OnInit} from "@angular/core";
import {TagsService} from "../../services/tags.service";
import {Subscription} from "rxjs/Subscription";
import {ITag, Tag} from "../../model/tag";
import TagSelectType from "../../model/tag-select-type";
import {ActivatedRoute, Router} from "@angular/router";
import {TargetService} from "../../services/target.service";

@Component({
  selector: 'at-delete-tag',
  templateUrl: './delete-tag.component.html',
  styleUrls: ['./delete-tag.component.css']
})
export class DeleteTagComponent implements OnInit, OnDestroy {

  private selectedTags: ITag[] = [];
  private alltagsSearch: ITag[];
  unsubscribe: Subscription[] = [];
  private tagToDelete: ITag;
  private tagForReplace: Tag;
  private message: String;

  constructor(private tagService: TagsService,
              private targetService: TargetService,
              private route: ActivatedRoute,
              private router: Router) {
  }

  ngOnInit() {
    this.getSearchTags();
    this.tagToDelete = null;
    this.tagForReplace = null;

  }

  ngOnDestroy() {
    this.unsubscribe.forEach(s => s.unsubscribe());
  }


  getSearchTags() {
    var $sub = this.tagService
      .getAllSelectable('Ingredient,Rating,DishType,TagType,NonEdible', TagSelectType.Assign)
      .subscribe(p => {
        this.alltagsSearch = p;
      });
    this.unsubscribe.push($sub);
  }

  goToNext() {

    this.targetService.createPickupTarget("PickUpTarget", this.selectedTags)
      .subscribe(r => {
        var headers = r.headers;
        var location = headers.get("Location");
        var splitlocation = location.split("/");
        var target_id = splitlocation[splitlocation.length - 1];


        this.router.navigate(["plan/dinnertonight/two", target_id]);

      });

  }

  selectTag(tag: Tag) {
    if (!this.tagToDelete) {
      this.tagToDelete = tag;
      this.message = "";
    } else {
      this.tagForReplace = tag;
    }
  }

  hasDeleteTag() {
    return this.tagToDelete != null;
  }

  hasReplaceTag() {
    return this.tagForReplace != null;
  }


  replaceTag() {
    var deletedName = this.tagToDelete.name;
    this.tagService.replaceTagGlobally(this.tagToDelete, this.tagForReplace)
      .subscribe(r => {
        {
          this.ngOnInit()
        }
      });
  }
}
