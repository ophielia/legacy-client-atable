import {Component, OnInit} from "@angular/core";
import {ActivatedRoute, Router} from "@angular/router";
import {Dish} from "../../model/dish";
import {DishService} from "../../services/dish-service.service";
import {TagsService} from "../../services/tags.service";
import TagType from "../../model/tag-type";
import {TagDrilldown} from "../../model/tag-drilldown";
import {Tag} from "../../model/tag";
import {TagCommService} from "../../legacy/drilldown/tag-drilldown-select.service";

@Component({
  selector: 'at-add-dish-general',
  templateUrl: './add-dish-general.component.html',
  styleUrls: ['./add-dish-general.component.css']
})
export class AddDishGeneralComponent implements OnInit {
  generalList: TagDrilldown[];

  dishId: string;
  dish: Dish;
  tagsToAdd: Tag[] = [];
  private tagSelectEvent: any;
  originalTags: Tag[];

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
      this.getGeneralTags();
    });
    this.tagSelectEvent = this.tagCommService.selectEvent
      .subscribe(selectevent => {
        this.addTagToDish(selectevent);
      })
  }


  getDish(id: string) {
    this.dishService
      .getById(id)
      .subscribe(p => {
        this.dish = p;
        this.pullGeneralTags();
      });
  }

  getGeneralTags() {
    this.tagService
      .getTagDrilldownList(TagType.TagType)
      .subscribe(l => this.generalList = l);
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

  goToNext() {
    this.save();
    this.router.navigate(['/adddish/finish/', this.dishId]);
  }

  goToPrevious() {
    this.save();
    this.router.navigate(['/adddish/ingredients/', this.dishId]);

  }


  save() {
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
    this.dishService.addAndRemoveTags(this.dish, toAdd, toRemove, false).subscribe();
  }


  private pullGeneralTags() {
    this.originalTags = this.dish.tags.filter(t => t.tag_type == TagType.TagType);
    this.originalTags.forEach(t => this.tagsToAdd.push(t));
  }
}
