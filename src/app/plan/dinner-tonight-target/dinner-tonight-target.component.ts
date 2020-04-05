import {Component, OnDestroy, OnInit} from "@angular/core";
import {TagsService} from "../../services/tags.service";
import {Subscription} from "rxjs/Subscription";
import {ITag, Tag} from "../../model/tag";
import TagSelectType from "../../model/tag-select-type";
import {ActivatedRoute, Router} from "@angular/router";
import {Target} from "../../model/target";
import {TargetService} from "../../services/target.service";
import {ProposalService} from "../../services/proposal.service";
import {HttpResponse} from "@angular/common/http";

@Component({
  selector: 'at-dinner-tonight-target',
  templateUrl: './dinner-tonight-target.component.html',
  styleUrls: ['./dinner-tonight-target.component.css']
})
export class DinnerTonightTargetComponent implements OnInit, OnDestroy {
  slotId: string;
  targetId: string;
  target: Target;

  private selectedTags: ITag[] = [];
  alltagsSearch: ITag[];
  unsubscribe: Subscription[] = [];

  constructor(private tagService: TagsService,
              private targetService: TargetService,
              private proposalService: ProposalService,
              private route: ActivatedRoute,
              private router: Router) {
    this.targetId = this.route.snapshot.params['id'];
  }

  ngOnInit() {
    this.getSearchTags();
    this.getTarget();
  }

  ngOnDestroy() {
    this.unsubscribe.forEach(s => s.unsubscribe());
  }


  getSearchTags() {
    var $sub = this.tagService
      .getAllSelectable('Rating,DishType,TagType', TagSelectType.Search)
      .subscribe(p => {
        this.alltagsSearch = p;
      });
    this.unsubscribe.push($sub);
  }

  getTarget() {
    var $sub = this.targetService
      .getById(this.targetId)
      .subscribe(p => {
        this.target = p;
        this.setSlotId(p);
      });
    this.unsubscribe.push($sub);
  }

  setSlotId(target: Target) {
    if (target.target_slots && target.target_slots.length > 0) {
      this.slotId = target.target_slots[0].target_slot_id;
    }
  }

  goToNext() {
    this.proposalService.generateProposal(this.targetId)
      .subscribe(r => {
        //var resp : HttpResponse<any> = r;
        var headers = r.headers;
        var location = headers.get("Location");
        var splitlocation = location.split("/");
        var proposal_id = splitlocation[splitlocation.length - 1];
        this.router.navigate(["plan/dinnertonight/result", proposal_id]);
      });
  }

  selectTag(tag: Tag) {
    let match = this.selectedTags.filter(t => t.tag_id == tag.tag_id);
    if (match && match.length > 0) {
      return;
    }
    this.selectedTags.push(tag);
    this.addToTarget(tag);
  }

  addToTarget(tag: ITag) {
    if (this.slotId) {
      this.targetService.moveTagToTargetSlot(this.targetId, tag.tag_id, null, this.slotId).subscribe();
    }
  }

  removeTag(tag: Tag) {
    this.selectedTags = this.selectedTags.filter(t => t.tag_id != tag.tag_id);
  }

  hasSelectedTags() {
    return (this.selectedTags && this.selectedTags.length > 0);
  }

}
