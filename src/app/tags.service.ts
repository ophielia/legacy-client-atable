import { Injectable } from '@angular/core';
import {Tag} from "./tag";

@Injectable()
export class TagsService {

  constructor() { }

  getAll(): Tag[] {
      return [
        {tag_id:1, name: 'carrot', description: 'orange'},
        {tag_id:2, name: 'easy', description: 'easy to make'},
        {tag_id:3, name: 'cheap', description: 'not expensive'}
      ];
  }

}
