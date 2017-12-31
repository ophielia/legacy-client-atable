import {Component, OnInit} from '@angular/core';
import {TargetService} from "../target.service";
import {Target} from "../model/target";
import {Router} from "@angular/router";

@Component({
  selector: 'at-target-list',
  templateUrl: './target-list.component.html',
  styleUrls: ['./target-list.component.css']
})
export class TargetListComponent implements OnInit {
  private targetService: TargetService;
  targets: Target[];
  errorMessage: string;
  showAdd: boolean;

  constructor(targetService: TargetService, private router: Router) {
    this.targetService = targetService;
  }

  ngOnInit() {
    this.showAdd = false;
    this.getAllTargets();
  }

  getAllTargets() {
    this.targetService
      .getAll()
      .subscribe(p => this.targets = p,
        e => this.errorMessage = e);
  }

  showAddInput() {
    this.showAdd = true;
  }

  addTarget(targetName: string) {
    this.targetService.addTarget(targetName)
      .subscribe(r => {
        console.log(`added!!! target`)
        var headers = r.headers;
        var location = headers.get("Location");
        var splitlocation = location.split("/");
        var id = splitlocation[splitlocation.length - 1];
        //    this.getAllDishes();
        this.router.navigate(['/targets/edit', id]);
      });
  }

  deleteTarget(targetId: string) {
    this.targetService.deleteTarget(targetId)
      .subscribe(r => {
        this.getAllTargets();
      })
  }


}
