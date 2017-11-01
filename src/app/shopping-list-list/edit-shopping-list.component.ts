import {Component, OnInit} from '@angular/core';
import {ShoppingListService} from "../shopping-list.service";
import {ActivatedRoute, Router} from "@angular/router";
import {ShoppingList} from "../model/shoppinglist";

@Component({
  selector: 'at-edit-shopping-list',
  templateUrl: './edit-shopping-list.component.html',
  styleUrls: ['./edit-shopping-list.component.css']
})
export class EditShoppingListComponent implements OnInit {
  private shoppingListId: string;
  private sub: any;
  shoppingList: ShoppingList = <ShoppingList>{list_id: "", list_type: ""};

  constructor(private shoppingListService: ShoppingListService,
              private route: ActivatedRoute,
              private router: Router,) {
    this.shoppingListId = this.route.snapshot.params['id'];
  }

  ngOnInit() {
    this.sub = this.route.params.subscribe(params => {
      let id = params['id'];
      console.log('getting dish with id: ', id);
      this.shoppingListService
        .getById(id)
        .subscribe(p => this.shoppingList = p);
    });
  }

  ngOnDestroy() {
    this.sub.unsubscribe();
  }
}
