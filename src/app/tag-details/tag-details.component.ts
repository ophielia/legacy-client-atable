import {Component, Input, OnDestroy, OnInit} from "@angular/core";
import {Tag} from "../tag";
import {ActivatedRoute, Router} from "@angular/router";
import {MockTagsService} from "../mock-tags.service";

@Component({
  selector: 'at-tag-details',
  template: `
    <section *ngIf="tag">
      <h2>You selected: {{tag.name}}</h2>
      <h3>Description</h3>
      <p>
        {{tag.name}} : with description {{tag.description}} and id {{tag.tag_id}}.
      </p>
    </section>

    <! -- NEW BUTTON HERE! -->
    <button (click)="gotoTagList()">Back to tag list</button>
    

  `,
  styles: []
})
export class TagDetailsComponent implements OnInit , OnDestroy {
  @Input() tag : Tag;
sub: any;
  constructor(private tagService: MockTagsService,
  private route:ActivatedRoute,
  private router : Router) {
  }

  ngOnInit() {
    this.sub = this.route.params.subscribe(params => {
      let tag_id = Number.parseInt(params['tag_id']);
      this.tag = this.tagService.getById(tag_id.toString());
    });
  }

  ngOnDestroy(){
    this.sub.unsubscribe();
  }

  gotoTagList(){
    let link = ['/tags'];
    this.router.navigate(link);
  }

}
