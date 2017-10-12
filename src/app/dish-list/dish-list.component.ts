import {Component, OnInit} from '@angular/core';
import {Dish} from "../model/dish";
import {DishService} from "../dish-service.service";
import {Router} from "@angular/router";

@Component({
  selector: 'at-dish-list',
  templateUrl: './dish-list.component.html',
  styleUrls: ['./dish-list.component.css']
})
export class DishListComponent implements OnInit {


  private dishService: DishService;
  dishes: Dish[] = [];
  errorMessage: string;

  constructor(dishService: DishService, private router: Router) {
    this.dishService = dishService;
  }

  edit(tagId: string) {
    this.router.navigate(['/dish/edit', tagId]);
  }

  ngOnInit() {
    this.dishService
      .getAll()
      .subscribe(p => this.dishes = p,
        e => this.errorMessage = e);
  }

}
