import {Component, OnInit} from '@angular/core';
import {ListLayoutService} from "../../services/list-layout.service";
import {Router} from "@angular/router";
import {ListLayout} from "../../model/listlayout";
import ListLayoutType from "../../model/list-layout-type";


@Component({
  selector: 'at-list-layout-list',
  templateUrl: './list-layout-list.component.html',
  styleUrls: ['./list-layout-list.component.css']
})
export class ListLayoutListComponent implements OnInit {

  private listLayoutService: ListLayoutService;
  allLayouts: { [id: string]: ListLayout; } = {};
  public errorMessage: string;
  public layoutTypes: string[];

  constructor(listLayoutService: ListLayoutService, private router: Router) {
    this.listLayoutService = listLayoutService;
    this.layoutTypes = ListLayoutType.listAll();
  }

  ngOnInit() {
    this.getAllListLayouts();
  }

  private getAllListLayouts() {

    var all: ListLayout[];
    this.listLayoutService
      .getAll()
      .subscribe(p => {
          p.forEach(l => {
            var key = l.list_layout_type;
            this.allLayouts[key] = l;
          })

        },
        e => this.errorMessage = e);

  }

  createLayout(layoutType: string) {
    this.listLayoutService.addListLayout(layoutType)
      .subscribe(r => {
        this.getAllListLayouts()
      });
  }


}
