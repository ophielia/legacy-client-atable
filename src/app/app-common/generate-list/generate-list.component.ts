import {Component, EventEmitter, OnInit, Output} from '@angular/core';
import {IListGenerateProperties} from "../../model/listgenerateproperties";

@Component({
  selector: 'at-generate-list',
  templateUrl: './generate-list.component.html',
  styleUrls: ['./generate-list.component.css']
})
export class GenerateListComponent implements OnInit {
  @Output() generateProperties: EventEmitter<IListGenerateProperties> = new EventEmitter<IListGenerateProperties>();


  addFromBase: boolean = true;
  addFromPickUp: boolean = true;
  saveMealPlan: boolean = true;

  constructor() {
  }

  ngOnInit() {
  }

  propertiesSelected() {
    var properties: IListGenerateProperties = <IListGenerateProperties>({
      add_from_base: this.addFromBase,
      add_from_pickup: this.addFromPickUp,
      generate_mealplan: this.saveMealPlan,
    });
    this.generateProperties.emit(properties);
  }

}
