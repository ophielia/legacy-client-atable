import {Component, OnInit} from '@angular/core';
import {Dish} from "../../model/dish";
import {ActivatedRoute, Router} from "@angular/router";
import {DishService} from "../../services/dish-service.service";

@Component({
  selector: 'at-add-dish-finish',
  templateUrl: './add-dish-finish.component.html',
  styleUrls: ['./add-dish-finish.component.css']
})
export class AddDishFinishComponent implements OnInit {

  dishId: string;
  dish: Dish;

  constructor(private route: ActivatedRoute,
              private dishService: DishService) {
    this.dishId = this.route.snapshot.params['id'];
  }

  ngOnInit() {
    this.route.params.subscribe(params => {
      let id = params['id'];
      console.log('getting dish with id: ', id);
      this.getDish(id);
    });
  }


  getDish(id: string) {
    this.dishService
      .getById(id)
      .subscribe(p => {
        this.dish = p;
      });
  }
}
