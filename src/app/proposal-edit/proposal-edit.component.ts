import {Component, OnInit} from '@angular/core';
import {ProposalService} from "../proposal.service";
import {ActivatedRoute, Router} from "@angular/router";
import {Proposal} from "../model/proposal";

@Component({
  selector: 'at-proposal-edit',
  templateUrl: './proposal-edit.component.html',
  styleUrls: ['./proposal-edit.component.css']
})
export class ProposalEditComponent implements OnInit {
  proposalId: string;
  name: string;

  proposal: Proposal = <Proposal>{proposal_id: "", target_name: ""};
  sub: any;
  private errorMessage: string;


  constructor(private proposalService: ProposalService,
              private route: ActivatedRoute,
              private router: Router,) {
    this.proposalId = this.route.snapshot.params['id'];
  }

  ngOnInit() {
    this.sub = this.route.params.subscribe(params => {
      let id = params['id'];
      console.log('getting proposal with id: ', id);
      this.refreshProposal(id);
    });
  }

  ngOnDestroy() {
    this.sub.unsubscribe();
  }


  selectDishForSlot(dish_id: string, slot_id: string) {
    /* this.proposalService.addTagToProposal(this.proposalId, tag.tag_id)
     .subscribe(p => {
     this.refreshProposal(this.proposalId)
     });*/
  }


  clearDishFromSlot(slot_id: string) {
    /* this.proposalService.removeTagFromProposal(this.proposalId, tag_id)
     .subscribe(p => {
     this.refreshProposal(this.proposalId)
     });
     console.log("remove tag from proposal" + tag_id);*/
  }


  private refreshProposal(proposalid: any) {
    this.proposalService
      .getById(proposalid)
      .subscribe(p => this.proposal = p);

  }


}
