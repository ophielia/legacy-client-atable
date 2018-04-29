import {Component, EventEmitter, Input, OnDestroy, OnInit, Output} from '@angular/core';
import {ITag} from "../../model/tag";
import TagSelectType from "../../model/tag-select-type";
import {Dish} from "../../model/dish";
import TagType from "../../model/tag-type";
import {TagsService} from "../../services/tags.service";
import {Subscription} from "rxjs/Subscription";

@Component({
  selector: 'at-tag-select',
  templateUrl: './tag-select.component.html',
  styleUrls: ['./tag-select.component.css']
})
export class TagSelectComponent implements OnInit, OnDestroy {
  unsubscribe: Subscription[] = [];
  @Output() tagSelected: EventEmitter<ITag> = new EventEmitter<ITag>();
  @Output() cancelAddTag: EventEmitter<boolean> = new EventEmitter<boolean>();
  @Input() tagTypes: string;
  @Input() showText: string;
  @Input() addOverlayClass: string;
  @Input() showCancelButton: boolean = false;
  @Input() allowAdd: boolean = false;
  @Input() selectType: string = TagSelectType.Assign;
  @Input() passedInputStyle: any;
  @Input() showAsInputGroup: any = true;
  @Input() tagList: ITag[];

  autoSelectedTag: any;
  filteredTags: ITag[];
  dispClass: string = 'atinput-dish';

  name: string;
  dish: Dish = <Dish>{dish_id: "", name: "", description: ""};
  private errorMessage: string;
  currentSelect: string;
  showAddTags: boolean;

  allTagTypes: string[];


  constructor(private tagService: TagsService) {
    this.allTagTypes = TagType.listAll();
  }

  ngOnInit() {
    this.autoSelectedTag = null;
    this.showAddTags = false;

    this.currentSelect = this.selectType;
    if (this.passedInputStyle) {
      this.dispClass = this.passedInputStyle;
    }

  }

  filterTags(event) {
    console.log('query:' + event.query);
    if (event.query) {
      if (this.tagList) {
        let filterBy = event.query.toLocaleLowerCase();
        this.filteredTags = this.tagList.filter((tag: ITag) =>
        tag.name.toLocaleLowerCase().indexOf(filterBy) !== -1);
        this.showAddTags = this.filteredTags.length == 0 && this.allowAdd;
      }
    } else {
      this.filteredTags = null;
      this.showAddTags = false;
    }
  }

  bingo(event) {
    this.tagSelected.emit(event);
    this.autoSelectedTag = null;
    this.filteredTags = null;
    if (event) {
      event.panelVisible = false;
    }
  }

  cancelAdd() {
    this.showAddTags = false;
    this.autoSelectedTag = null;
    this.filteredTags = null;
  }

  checkSearchEnter(el) {
    // when the user clicks on return from the search box
    // if only one tag is in the list, select this tag
    if (this.filteredTags && this.filteredTags.length == 1) {
      this.bingo(this.filteredTags[0]);
      if (el) {
        el.panelVisible = false;
      }
    }
  }

  isIncluded(tagtype: string) {
    if (!this.allowAdd) {
      return false;
    }
    return this.tagTypes.indexOf(tagtype) >= 0;

  }

  cancelSelectTag() {
    this.cancelAddTag.emit(true);
  }

  add(tagtype: string) {
    var $sub = this.tagService.addTag(this.autoSelectedTag, tagtype)
      .subscribe(r => {
        this.autoSelectedTag = null;
        var headers = r.headers;
        var location = headers.get("Location");
        var splitlocation = location.split("/");
        var id = splitlocation[splitlocation.length - 1];
        this.tagService.getById(id)
          .subscribe(t => {
            this.showAddTags = false;
            this.autoSelectedTag = null;
            this.tagSelected.emit(t);
          });


      });
    this.unsubscribe.push($sub);
  }

  ngOnDestroy() {
    this.unsubscribe.forEach(s => s.unsubscribe());

  }

}


