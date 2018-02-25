import {Component, EventEmitter} from '@angular/core';
import {Router} from '@angular/router';
import {TagsService} from "../../services/tags.service";
import TagType from "../../model/tag-type";


@Component({
  selector: 'add-tag-view',
  templateUrl: './add-tag.component.html'
})
export class AddTagComponent {
  tagName: string;
  ingredientType: string = TagType.Ingredient;
  dishType: string = TagType.DishType;
  ratingType: string = TagType.Rating;
  tagType: string = TagType.TagType;
  nonEdible: string = TagType.NonEdible;

  constructor(
    private tagService: TagsService,
    private router: Router) { }

  add(tagType: string) {
    console.log("tag type is " + tagType);
    this.tagService.addTag(this.tagName, tagType)
      .subscribe(r => console.log(`added!!! this.tagName`));
    this.router.navigate(['/list']);
  }
}
