import {Component, EventEmitter, Input, OnDestroy, OnInit, Output} from '@angular/core';
import {ITag} from "../../model/tag";
import TagSelectType from "../../model/tag-select-type";
import {Dish} from "../../model/dish";
import {TagsService} from "../../services/tags.service";
import TagType from "../../model/tag-type";

@Component({
  selector: 'at-tag-select',
  templateUrl: './tag-select.component.html',
  styleUrls: ['./tag-select.component.css']
})
export class TagSelectComponent implements OnInit, OnDestroy {
  @Output() tagSelected: EventEmitter<ITag> = new EventEmitter<ITag>();
  @Input() tagTypes: string;
  @Input() showText: string;
  @Input() selectType: string = TagSelectType.Assign;
  @Input() passedInputStyle: any;
  @Input() showAsInputGroup: any = true;


  autoSelectedTag: any;
  filteredTags: ITag[];
  alltags: ITag[];
  dispClass: string = 'atinput-dish';

  name: string;
  dish: Dish = <Dish>{dish_id: "", name: "", description: ""};
  private errorMessage: string;
  currentSelect: string;
  includedTypes: Map<string, boolean> = new Map<string, boolean>();
  showAddTags: boolean;

  allTagTypes: string[];
  lastSelectedId: string = "";


  constructor(private tagService: TagsService) {
    this.allTagTypes = TagType.listAll();
  }

  ngOnInit() {
    for (var i = 0; i < this.allTagTypes.length; i++) {
      let ttype = this.allTagTypes[i];
      // get / fill tag lists here from service
      if (this.tagTypes.includes(ttype)) {
        this.includedTypes[ttype] = true;
      } else {
        this.includedTypes[ttype] = false;
      }
    }

    this.autoSelectedTag = null;
    this.currentSelect = this.selectType;
    if (this.passedInputStyle) {
      this.dispClass = this.passedInputStyle;
    }
    this.getAllTags();

  }

  filterTags(event) {
    if (event.query) {
      if (this.alltags) {
        let filterBy = event.query.toLocaleLowerCase();
        this.filteredTags = this.alltags.filter((tag: ITag) =>
        tag.name.toLocaleLowerCase().indexOf(filterBy) !== -1);
        this.showAddTags = this.filteredTags.length == 0;
      }
    } else {
      this.filteredTags = null;
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

  getAllTags() {
    this.tagService
      .getAllSelectable(this.tagTypes, this.selectType)
      .subscribe(p => {
          this.alltags = p;
          this.showAddTags = (this.alltags.length == 0);
        },
        e => this.errorMessage = e);

  }

  ngOnDestroy() {

  }

  /*showSelected(tag: ITag) {
   if (this.lastSelectedId != tag.tag_id) {
   this.lastSelectedId = tag.tag_id;
   console.log('showing from drilldown select container-' + tag.tag_id);
   this.autoSelectedTag = null;
   this.tagSelected.emit(tag);
   }
   }


   add(tagType: string) {
   var tagName = this.autoSelectedTag;
   console.log("tag type is " + tagType);
   this.tagService.addTag(tagName, tagType)
   .subscribe(r => {
   console.log(`added!!! this.tagName`);
   this.autoSelectedTag = null;
   var headers = r.headers;
   var location = headers.get("Location");
   var splitlocation = location.split("/");
   var id = splitlocation[splitlocation.length - 1];
   this.tagService.getById(id)
   .subscribe(t => {
   this.showSelected(t);
   });

   this.getAllTags();
   });
   }*/
}


