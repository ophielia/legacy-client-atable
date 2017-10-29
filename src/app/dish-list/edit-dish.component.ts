import {Component, OnDestroy, OnInit} from "@angular/core";
import {Dish} from "../model/dish";
import {ActivatedRoute, Router} from "@angular/router";
import {DishService} from "../dish-service.service";
import {TagDrilldown} from "../model/tag-drilldown";

@Component({
  selector: 'at-edit-dish',
  templateUrl: './edit-dish.component.html',
  styleUrls: ['./edit-dish.component.css']
})
export class EditDishComponent implements OnInit, OnDestroy {
  dishId: string;
  name: string;
  dish: Dish = <Dish>{dish_id: "", name: "", description: ""};
  sub: any;
  private errorMessage: string;
  selectedTag: TagDrilldown;


  constructor(private dishService: DishService,
              private route: ActivatedRoute,
              private router: Router,) {
    this.dishId = this.route.snapshot.params['id'];
  }

  ngOnInit() {
    this.sub = this.route.params.subscribe(params => {
      let id = params['id'];
      console.log('getting dish with id: ', id);
      this.dishService
        .getById(id)
        .subscribe(p => this.dish = p);
    });
  }

  ngOnDestroy() {
    this.sub.unsubscribe();
  }

  showTag(tag: TagDrilldown) {
    this.selectedTag = tag;
    return false;
  }

  save() {
    this.dishService.saveDish(this.dish)
      .subscribe(r => {
        console.log(`saved!!! ${JSON.stringify(this.dish)}`,
          e => this.errorMessage = e,
          this.goToList());
      });
  }

  deleteTag(tag: TagDrilldown) {
    // remove tag from model
    this.dish.tags = this.dish.tags.filter(t => t.tag_id != tag.tag_id);
    // remove tag from backend
    this.dishService.removeTagFromDish(this.dish.dish_id, tag.tag_id)
      .subscribe();
  }

  addTag(tag: TagDrilldown) {
    // add tag to model
    var tagExists = this.dish.tags.filter(t => t.tag_id == tag.tag_id);
    if (tagExists.length > 0) {
      // tag already in dish - don't add again
      return;
    }
    // add tag in back end
    var dishtags = this.dish.tags.slice(0);
    dishtags.push(tag);
    this.dish.tags = dishtags;
    this.dishService.addTagToDish(this.dish.dish_id, tag.tag_id)
      .subscribe();
    return false;
  }

  goToList() {
    this.router.navigate(['/dish/list']);
  }


}
