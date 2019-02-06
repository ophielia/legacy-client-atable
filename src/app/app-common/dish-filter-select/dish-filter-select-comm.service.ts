import {Injectable} from '@angular/core';
import {Subject} from 'rxjs';

@Injectable()
export class DishFilterSelectCommService {

  // Observable string sources
  private dishSelectedSource = new Subject<string>();

  // Observable string streams
  dishSelectedObs$ = this.dishSelectedSource.asObservable();

  // Service message commands
  dishSelected() {
    this.dishSelectedSource.next();
  }

}
