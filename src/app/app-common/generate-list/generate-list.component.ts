import {Component, EventEmitter, OnInit, Output, Input} from '@angular/core';
import {IListGenerateProperties} from "../../model/listgenerateproperties";

@Component({
  selector: 'at-generate-list',
  templateUrl: './generate-list.component.html',
  styleUrls: ['./generate-list.component.css']
})
export class GenerateListComponent implements OnInit {
  @Output() generateProperties: EventEmitter<IListGenerateProperties> = new EventEmitter<IListGenerateProperties>();
  @Input() showMealPlanOption: boolean = true;

  addFromBase: boolean = true;
  saveMealPlan: boolean = true;

  constructor() {
    if (this.showMealPlanOption == false) {
      this.saveMealPlan = false;
    }
  }

  ngOnInit() {
  }

  propertiesSelected() {
    var properties: IListGenerateProperties = <IListGenerateProperties>({
      add_from_starter: this.addFromBase,
      generate_mealplan: this.saveMealPlan,
    });
    this.generateProperties.emit(properties);
  }

}
