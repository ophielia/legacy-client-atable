import {Component, OnInit} from '@angular/core';
import {ProposalService} from "../../services/proposal.service";
import {ActivatedRoute, Router} from "@angular/router";
import {Proposal} from "../../model/proposal";
import {ProposalSlot} from "../../model/proposal-slot";

@Component({
  selector: 'at-proposal-edit',
  templateUrl: './proposal-edit.component.html',
  styleUrls: ['./proposal-edit.component.css']
})
export class ProposalEditComponent implements OnInit {
  allSelected: boolean;
  proposalId: string;
  name: string;
  showAllFlag: boolean = false;
  proposal: Proposal = <Proposal>{proposal_id: "", target_name: ""};
  sub: any;
  private errorMessage: string;
  private displayDishDetails: string;


  constructor(private proposalService: ProposalService,
              private route: ActivatedRoute,
              private router: Router,) {
    this.proposalId = this.route.snapshot.params['id'];
  }

  ngOnInit() {
    this.displayDishDetails = "";
    this.sub = this.route.params.subscribe(params => {
      let id = params['id'];
      console.log('getting proposal with id: ', id);
      this.refreshProposal(id);
    });
  }


  ngOnDestroy() {
    this.sub.unsubscribe();
  }

  showAll(selected_index: number) {
    if (selected_index == -1) {
      return true;
    }
    return this.showAllFlag;
  }

  getDishDisplayDate(date_millis) {
    if (date_millis) {
      return new Date(date_millis).toLocaleDateString();

    }
    return "not yet added"
  }

  displayDetails(dish_id: string) {
    this.displayDishDetails = dish_id;
  }

  hideDetails(dish_id: string) {
    this.displayDishDetails = "";
  }

  showDishDetails(dish_id: string) {
    return this.displayDishDetails == dish_id;
  }

  selectDishForSlot(dish_id: string, slot_id: string, idx: number) {
    this.proposalService.selectDishForSlot(this.proposalId, slot_id, dish_id)
      .subscribe();
    let allSelectedCheck = true;
    for (var i = 0; i < this.proposal.proposal_slots.length; i++) {
      if (this.proposal.proposal_slots[i].slot_id == slot_id) {
        let slot = this.proposal.proposal_slots[i];
        slot.dish_slot_list.map(d => {
          if (d.dish.dish_id == dish_id) {
            d.selected = true;
            slot.selected_dish_index = idx;
          } else {
            d.selected = false;
          }
        });
      } else if (this.proposal.proposal_slots[i].selected_dish_index < 0) {
        allSelectedCheck = false;
      }
    }

    this.allSelected = allSelectedCheck;

  }

  clearDishFromSlot(dish_id: string, slot_id: string) {
    this.proposalService.clearDishFromSlot(this.proposalId, slot_id, dish_id)
      .subscribe();
    this.allSelected = false;
    for (var i = 0; i < this.proposal.proposal_slots.length; i++) {
      if (this.proposal.proposal_slots[i].slot_id == slot_id) {
        let slot = this.proposal.proposal_slots[i];
        slot.selected_dish_index = -1;
        slot.dish_slot_list.filter(t => t.dish.dish_id == dish_id).map(d => d.selected = false);
      }
    }

  }

  generateMealPlan() {
    this.proposalService.generateMealPlan(this.proposalId)
      .subscribe(r => {
        console.log(`added!!! target`)
        var headers = r.headers;
        var location = headers.get("Location");
        var splitlocation = location.split("/");
        var id = splitlocation[splitlocation.length - 1];
        //    this.getAllDishes();
        this.router.navigate(['/mealplan/edit', id]);
      });
  }

  doRefreshProposal(direction: string) {
    this.proposalService.refreshProposal(this.proposalId, direction)
      .subscribe(r => {
        this.refreshProposal(this.proposalId);
      });
  }

  addToSlot(slot_id: string) {
    this.proposalService.refreshProposalSlot(this.proposalId, slot_id)
      .subscribe(r => {
        this.refreshProposal(this.proposalId);
      });

  }

  private refreshProposal(proposalid: any) {
    this.proposalService
      .getById(proposalid)
      .subscribe(p => {
        this.proposal = p;
        this.checkAllSelected();
        this.proposalId = this.proposal.proposal_id;
      });

  }

  private checkAllSelected() {
    let allSelectedCheck = true;
    for (var i = 0; i < this.proposal.proposal_slots.length; i++) {
      if (this.proposal.proposal_slots[i].selected_dish_index == -1) {
        allSelectedCheck = false;
      }
    }

    this.allSelected = allSelectedCheck;
  }
}
