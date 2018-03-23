import {Component, OnInit} from '@angular/core';
import {TagCommService} from "../../legacy/drilldown/tag-drilldown-select.service";
import {IShoppingList, ShoppingList} from "../../model/shoppinglist";
import {ActivatedRoute, Router} from "@angular/router";
import {ShoppingListService} from "../../services/shopping-list.service";
import {TagsService} from "../../services/tags.service";
import {Tag} from "../../model/tag";

@Component({
  selector: 'at-edit-shopping-list',
  templateUrl: './edit-shopping-list.component.html',
  styleUrls: ['./edit-shopping-list.component.css']
})
export class EditShoppingListComponent implements OnInit {
  tagSelectEvent: any;
  shoppingListId: any = ShoppingList;
  private shoppingList: IShoppingList;
  showMenu: boolean;

  constructor(private route: ActivatedRoute,
              private router: Router,
              private shoppingListService: ShoppingListService,
              private tagService: TagsService,
              private tagCommService: TagCommService) {
    this.shoppingListId = this.route.snapshot.params['id'];


  }

  ngOnInit() {
    this.route.params.subscribe(params => {
      let id = params['id'];
      console.log('getting dish with id: ', id);
      this.getShoppingList(id);
    });
    this.tagSelectEvent = this.tagCommService.selectEvent
      .subscribe(selectevent => {
        this.addTagToList(selectevent);
      })
  }


  getShoppingList(id: string) {
    this.shoppingListService
      .getById(id)
      .subscribe(p => {
        this.shoppingList = p;
      });
  }

  private addTagToList(tag: Tag) {

  }

  toggleMenu() {
    this.showMenu = !this.showMenu;
  }
}
