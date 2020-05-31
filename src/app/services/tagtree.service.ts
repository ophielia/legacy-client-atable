import {Injectable, OnDestroy, OnInit} from '@angular/core';
import 'rxjs/add/operator/filter';
import {LegendSource} from "../model/legend-source";
import {LegendPoint} from "../model/legend-point";
import {LegendIconSource} from "../model/legend-icon-source";
import {TagsService} from "./tags.service";
import { TagTree } from './tagtree.object';
import {Subscription} from "rxjs/Subscription";


@Injectable({providedIn: 'root'})
export class TagTreeService implements OnInit, OnDestroy {
  static instance: TagTreeService;
  static refreshPeriod = 5 * 60 * 1000;
  static  BASE_GROUP: number = 0;

  unsubscribe: Subscription[] = [];
  private _tagTree: TagTree;
  private _lastLoaded: number;

  constructor(private tagService: TagsService) {
    // If the static reference doesn't exist
    // (i.e. the class has never been instantiated before)
    // set it to the newly instantiated object of this class
    if (!TagTreeService.instance) {
      TagTreeService.instance = this;
    }

    // Return the static instance of the class
    // Which will only ever be the first instance
    // Due to the if statement above
    return TagTreeService.instance;
  }

  ngOnInit() {
    this.createTagTree();


  }

  ngOnDestroy() {
    this.unsubscribe.forEach(s => s.unsubscribe());
  }

  private createTagTree() {
    let sub$ = this.tagService.getAllExtended(true).subscribe((value) => {
      this._tagTree = new TagTree(value);
      this._lastLoaded = new Date().getTime();
    });
    this.unsubscribe.push(sub$);
  }

  tagTree(): TagTree {
    if (this.refreshTagTree()) {
      this.createTagTree();
    }
    return this._tagTree;
  }

  private refreshTagTree() {
var limit = this._lastLoaded + TagTreeService.refreshPeriod;
return (new Date().getTime()) > limit;
  }
}
