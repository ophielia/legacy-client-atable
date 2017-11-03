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
  showAdd: boolean;


  private dishService: DishService;
  dishes: Dish[] = [];
  errorMessage: string;

  constructor(dishService: DishService, private router: Router) {
    this.dishService = dishService;
  }

  edit(tagId: string) {
    this.router.navigate(['/dish/edit', tagId]);
  }

  add() {
    this.showAdd = true;
    //this.router.navigate(['/dish/edit', tagId]);
  }

  addDish(dishName: string) {
    this.dishService.addDish(dishName)
      .subscribe(r => {
        console.log(`added!!! this.tagName`);
        this.getAllDishes();
      });
    //this.router.navigate(['/dish/edit', tagId]);
  }

  getAllDishes() {
    this.dishService
      .getAll()
      .subscribe(p => {
          this.dishes = p;
          this.sortDishes()
        },
        e => this.errorMessage = e);
  }

  sortDishes() {
    this.dishes.sort((a, b) => {
      if (a.name.toLowerCase() < b.name.toLowerCase()) return -1;
      else if (a.name.toLowerCase() > b.name.toLowerCase()) return 1;
      else return 0;
    });
  }

  ngOnInit() {
    this.getAllDishes();
  }

}
