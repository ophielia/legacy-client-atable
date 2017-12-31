import {Component, OnDestroy, OnInit} from "@angular/core";
import {Tag} from "../model/tag";
import {TagCommService} from "../drilldown/tag-drilldown-select.service";
import {Dish} from "../model/dish";
import {Target} from "../model/target";
import {TargetService} from "../target.service";
import {ActivatedRoute, Router} from "@angular/router";
import {TagsService} from "../tags.service";
import TagType from "../model/tag-type";

@Component({
  selector: 'at-target-edit',
  templateUrl: './target-edit.component.html',
  styleUrls: ['./target-edit.component.css']
})
export class TargetEditComponent implements OnInit, OnDestroy {
  slotsFilled: boolean;
  dishSlotTags: any;
  dishSlotTagIds: Map<string, string>;

  filterTags: Tag[];
  subTagEvent: any;
  tagCommService: TagCommService;
  targetDishIds: string[];
  dishList: Dish[];
  targetId: string;
  name: string;
  showTagSelect: boolean = true;

  target: Target = <Target>{target_id: "", target_name: ""};
  sub: any;
  private errorMessage: string;


  constructor(private targetService: TargetService,
              private tagService: TagsService,
              tagCommService: TagCommService,
              private route: ActivatedRoute,
              private router: Router,) {
    this.targetId = this.route.snapshot.params['id'];
    this.tagCommService = tagCommService;
    this.dishList = [];
    this.targetDishIds = [];
    this.dishSlotTags = new Set();
    this.slotsFilled = false;
  }

  ngOnInit() {
    this.sub = this.route.params.subscribe(params => {
      let id = params['id'];
      console.log('getting target with id: ', id);
      this.refreshTarget(id);
    });
    this.subTagEvent = this.tagCommService.selectEvent
      .subscribe(selectevent => {
        this.addTagToTarget(selectevent);
      })
    this.filterTags = [];
    // fill slot tag ids
    this.tagService
      .getAllSelectable(TagType.DishType)
      .subscribe(p => {
          this._fillSlots(p);
          this.slotsFilled = true;
        },
        e => this.errorMessage = e);

  }

  ngOnDestroy() {
    this.sub.unsubscribe();
  }


  toggleShowTagSelect() {
    this.showTagSelect = !this.showTagSelect;
  }

  addTagToTarget(tag: Tag) {
    this.targetService.addTagToTarget(this.targetId, tag.tag_id)
      .subscribe(p => {
        this.refreshTarget(this.targetId)
      });
  }


  removeTagFromTarget(tag_id: string) {
    this.targetService.removeTagFromTarget(this.targetId, tag_id)
      .subscribe(p => {
        this.refreshTarget(this.targetId)
      });
    console.log("remove tag from target" + tag_id);
  }

  deleteSlot(slotid: string) {
    this.targetService.deleteSlotFromTarget(this.targetId, slotid).subscribe(p => this.refreshTarget(this.targetId));

    console.log("slot added to target");
  }

  addSlot(tagkey: string) {
    let tagid = this.dishSlotTagIds.get(tagkey);
    this.targetService.addSlotToTarget(this.targetId, tagid).subscribe(p => this.refreshTarget(this.targetId));

    console.log("slot added to target");
  }


  private _fillSlots(rawlist: Tag[]) {
    this.dishSlotTagIds = new Map();
    this.dishSlotTags = new Set();

    // go through raw list, putting each name in dishSlotTags
    rawlist.forEach(t => {
      this.dishSlotTagIds.set(t.name, t.tag_id);
      this.dishSlotTags.add(t.name);
    });
  }

  private refreshTarget(targetid: any) {
    this.targetService
      .getById(targetid)
      .subscribe(p => this.target = p);

  }
}
