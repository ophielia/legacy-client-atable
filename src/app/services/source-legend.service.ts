import {Injectable} from '@angular/core';
import {IItemSource} from "../model/item-source";

@Injectable()
export class SourceLegendService {
  baseClassName: string;
  maxClasses: number = 20;

  constructor() {
    this.baseClassName = 'legend-';
  }

  createLegendForSources(dish_sources: IItemSource[], list_sources: IItemSource[]) {
    var legend = new Map();
    if (dish_sources) {
      for (var i = 0; i < dish_sources.length; i++) {
        var className = this.baseClassName + (i + 1);
        if (i > 19) {
          className = this.baseClassName + (i - 19);

        }
        legend.set(dish_sources[i].id, className);
      }
    }
    var listMarker = dish_sources.length + 1;
    if (list_sources) {
      for (var i = 0; i < list_sources.length; i++) {
        if (legend.get(list_sources[i].display)) {
          continue;
        }

        var className = this.baseClassName + (i + listMarker);
        if (i + listMarker > 19) {
          className = this.baseClassName + (i + listMarker - 19);
        }

        legend.set(list_sources[i].display, className);
      }
    }
    return legend;
  }
}
