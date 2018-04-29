import {Component, EventEmitter, Input, OnDestroy, OnInit, Output} from '@angular/core';
import {IDish} from "../../model/dish";
import TagSelectType from "../../model/tag-select-type";

@Component({
  selector: 'at-dish-select',
  templateUrl: './dish-select.component.html',
  styleUrls: ['./dish-select.component.css']
})
export class DishSelectComponent implements OnInit, OnDestroy {
  @Output() dishSelected: EventEmitter<IDish> = new EventEmitter<IDish>();
  @Output() cancelSelectDish: EventEmitter<boolean> = new EventEmitter<boolean>();
  @Input() tagTypes: string;
  @Input() showText: string;
  @Input() showCancelButton: boolean = false;
  @Input() selectType: string = TagSelectType.Assign;
  @Input() passedInputStyle: any;
  @Input() showAsInputGroup: any = true;
  @Input() dishList: IDish[];

  autoSelectedDish: any;
  filteredDishList: IDish[];
  dispClass: string = 'atinput-dish';

  name: string;


  constructor() {
  }

  ngOnInit() {
    this.autoSelectedDish = null;
  }

  filterDishes(event) {
    if (event.query) {
      if (this.dishList) {
        let filterBy = event.query.toLocaleLowerCase();
        this.filteredDishList = this.dishList.filter((tag: IDish) =>
        tag.name.toLocaleLowerCase().indexOf(filterBy) !== -1);
      }
    } else {
      this.filteredDishList = null;
    }
  }

  bingo(event) {
    this.dishSelected.emit(event);
    this.autoSelectedDish = null;
    this.filteredDishList = null;
    if (event) {
      event.panelVisible = false;
    }
  }


  checkSearchEnter(el) {
    // when the user clicks on return from the search box
    // if only one tag is in the list, select this tag
    if (this.filteredDishList && this.filteredDishList.length == 1) {
      this.bingo(this.filteredDishList[0]);
      if (el) {
        el.panelVisible = false;
      }
    }
  }

  cancelDishInput() {
    this.cancelSelectDish.emit(true);
  }


  ngOnDestroy() {

  }

}


