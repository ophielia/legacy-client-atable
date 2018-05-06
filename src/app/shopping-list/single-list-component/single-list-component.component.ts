import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
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
  @Output() delete: EventEmitter<String> = new EventEmitter<String>();

  constructor(private router: Router) {
  }

  ngOnInit() {
  }

  goToEdit() {
    this.router.navigate(["list/edit/", this.list.list_id]);
  }

  deleteList(list_id) {
    this.delete.emit(list_id);
  }
}
