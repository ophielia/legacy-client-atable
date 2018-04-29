import {Component, EventEmitter, Input, OnDestroy, OnInit, Output} from '@angular/core';
import {Category} from "../../../model/category";
import {ListLayoutService} from "../../../services/list-layout.service";
import {Subscription} from "rxjs/Subscription";

@Component({
  selector: 'at-edit-display-category',
  templateUrl: './edit-display-category.component.html',
  styleUrls: ['./edit-display-category.component.css']
})
export class EditDisplayCategoryComponent implements OnInit, OnDestroy {

  @Input() isEdit: boolean;
  @Input() layoutId: string;
  @Input() category: Category;
  @Output() showEdit: EventEmitter<string> = new EventEmitter<string>();
  @Output() doRefresh: EventEmitter<boolean> = new EventEmitter<boolean>();

  unsubscribe: Subscription[] = [];

  constructor(private listLayoutService: ListLayoutService) {

  }

  ngOnInit() {
  }


  editListLayoutCategory(category_id: string) {
    this.showEdit.emit(category_id);
  }

  cancelEditCategory() {
    this.showEdit.emit("0");
  }

  deleteListLayoutCategory(category_id: string) {
    var $sub = this.listLayoutService
      .deleteCategoryFromListLayout(this.layoutId, category_id)
      .subscribe(p => {
        this.doRefresh.emit(true);
      })
    this.unsubscribe.push($sub);
  }

  doEditListLayoutCategory(category_id: string, category_name: string) {
    var $sub = this.listLayoutService
      .updateCategoryInListLayout(this.layoutId, category_id, category_name)
      .subscribe(p => {
        this.doRefresh.emit(true);
        this.cancelEditCategory();
      })
    this.unsubscribe.push($sub);
  }

  ngOnDestroy() {
    this.unsubscribe.forEach(s => s.unsubscribe());

  }
}
