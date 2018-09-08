import {Component, OnDestroy, OnInit} from '@angular/core';
import {ProposalService} from "../../services/proposal.service";
import {ActivatedRoute, Router} from "@angular/router";
import {Proposal} from "../../model/proposal";
import {Subscription} from "rxjs/Subscription";

@Component({
  selector: 'at-dinner-tonight-result',
  templateUrl: './dinner-tonight-result.component.html',
  styleUrls: ['./dinner-tonight-result.component.css']
})
export class DinnerTonightResultComponent implements OnInit, OnDestroy {
  proposal: Proposal;
  private proposal_id: string;
  unsubscribe: Subscription[] = [];

  constructor(private proposalService: ProposalService,
              private route: ActivatedRoute,
              private router: Router) {
    this.proposal_id = this.route.snapshot.params['id'];
  }
  ngOnInit() {
    this.getProposal();
  }

  ngOnDestroy() {
    this.unsubscribe.forEach(s => s.unsubscribe());
  }

  getProposal() {
    this.proposalService.getById(this.proposal_id)
      .subscribe(p => {
        this.proposal = p;
      });
  }
}
