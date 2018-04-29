import {Component, Input, OnInit} from '@angular/core';
import {IShoppingList, ShoppingList} from "../../model/shoppinglist";
import {Router} from "@angular/router";

@Component({
  selector: 'at-single-list-component',
  templateUrl: './single-list-component.component.html',
  styleUrls: ['./single-list-component.component.css']
})
export class SingleListComponentComponent implements OnInit {

  @Input() list: ShoppingList;
  @Input() displayText: string = "List";

  constructor(private router: Router) {
  }

  ngOnInit() {
  }

  goToEdit() {
    this.router.navigate(["list/edit/", this.list.list_id]);
  }

}
