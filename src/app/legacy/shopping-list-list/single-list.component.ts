import {Component, EventEmitter, Input, OnInit, Output} from "@angular/core";
import {ShoppingList} from "../../model/shoppinglist";
import {Router} from "@angular/router";

@Component({
  selector: 'at-single-list',
  templateUrl: './single-list.component.html',
  styleUrls: ['./single-list.component.css']
})
export class SingleListComponent implements OnInit {

  @Input() shoppingList: ShoppingList;
  @Output() createList: EventEmitter<string> = new EventEmitter();
  @Output() deleteList: EventEmitter<string> = new EventEmitter();
  currentList: ShoppingList = <ShoppingList>{list_id: "", list_type: ""};

  constructor(private router: Router) {
  }

  ngOnInit() {
    this.currentList = this.shoppingList;
  }

  createNewList(listType: string) {
    this.createList.emit(listType);
  }

  deleteExistingList(list_id: string) {
    this.deleteList.emit(list_id);
  }
}
