import {Component, EventEmitter, OnDestroy, OnInit, Output} from "@angular/core";
import {ActivatedRoute, Router} from "@angular/router";
import {ListLayoutService} from "../../services/list-layout.service";
import {ListLayout} from "../../model/listlayout";

@Component({
  selector: 'at-edit-list-layout',
  templateUrl: './edit-list-layout.component.html',
  styleUrls: ['./edit-list-layout.component.css']
})
export class EditListLayoutComponent implements OnInit, OnDestroy {
  private layoutId: string;
  private listLayout: ListLayout;
  private subGetId: any;
  private showAdd: boolean = false;
  private showEdit: string;
  public loaded: boolean = false;

  constructor(private listLayoutService: ListLayoutService,
              private route: ActivatedRoute,
              private router: Router,) {
    this.layoutId = this.route.snapshot.params['id'];
  }

  ngOnInit() {
    this.subGetId = this.route.params.subscribe(params => {
      let id = params['id'];
      console.log('getting dish with id: ', id);
      this.refreshLayout(id);
    });
  }


  ngOnDestroy() {
    this.subGetId.unsubscribe();
  }

  showAddInput() {
    this.showAdd = true;
  }

  setShowEdit(edit_id: string) {
    this.showEdit = edit_id;
  }

  refreshLayout(id: string) {
    this.showEdit = "0";
    this.listLayoutService
      .getById(id)
      .subscribe(p => {
        this.listLayout = p;
        this.loaded = true;
      });
  }

  addCategory(categoryname: string) {
    this.listLayoutService
      .addCategoryToListLayout(this.layoutId, categoryname)
      .subscribe(p => {
        this.refreshLayout(this.layoutId);
        this.showAdd = false;
      })
  }

}
