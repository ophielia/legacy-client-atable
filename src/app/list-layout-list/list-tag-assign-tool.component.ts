import {Component, OnDestroy, OnInit} from "@angular/core";
import {ListLayoutService} from "../list-layout.service";
import {ActivatedRoute, Router} from "@angular/router";
import {ListLayout} from "../model/listlayout";
import {TagsService} from "../tags.service";
import {Tag} from "../model/tag";
import {ListLayoutCategory} from "../model/listcategory";

@Component({
  selector: 'at-list-tag-assign-tool',
  templateUrl: './list-tag-assign-tool.component.html',
  styleUrls: ['./list-tag-assign-tool.component.css']
})
export class ListTagAssignToolComponent implements OnInit, OnDestroy {
  showToRemove: boolean = false;
  tagsToRemove: Tag[];
  categoryTags: Tag[];
  tagsToAdd: Tag[];
  selectedCategory: ListLayoutCategory;
  private unCatTagList: Tag[];
  private layoutId: string;
  private subGetId: any;
  private listLayout: ListLayout;
  private loading: boolean = true;
  private showToAdd: boolean = false;
  private addLocked: boolean = true;
  private deleteLocked: boolean = true;

  constructor(private listLayoutService: ListLayoutService,
              private tagService: TagsService,
              private route: ActivatedRoute,
              private router: Router,) {
    this.layoutId = this.route.snapshot.params['id'];
  }

  ngOnInit() {
    this.unCatTagList = [];
    this.categoryTags = [];
    this.subGetId = this.route.params.subscribe(params => {
      let id = params['id'];
      console.log('getting dish with id: ', id);
      this.refreshLayout(id);
      this.retrieveTags(id);
    });
  }

  ngOnDestroy() {
    this.subGetId.unsubscribe();
  }

  refreshForCategory() {
    this.loading = true;
    this.retrieveTags(this.listLayout.layout_id);
    this.retrieveCategoryTags(this.selectedCategory.category_id);
    this.clearAllTagsToAdd();
    this.clearAllTagsToRemove();
    this.deleteLocked = false;
    this.addLocked = false;
  }

  refreshLayout(id: string) {
    this.listLayoutService
      .getById(id)
      .subscribe(p => {
        this.listLayout = p;
        this.loading = false;
      });
  }

  retrieveTags(id: string) {
    this.tagService
      .getUncategorizedTags(id)
      .subscribe(p => {
        this.unCatTagList = p;
        this.loading = false;
      });
  }

  clearCurrentCategory() {
    this.selectedCategory = null;
    this.categoryTags = [];
    this.deleteLocked = true;
    this.addLocked = true;
  }

  selectCategory(category: ListLayoutCategory) {
    this.selectedCategory = category;
    this.retrieveCategoryTags(category.category_id);
    this.deleteLocked = false;
    this.addLocked = false;
  }

  selectTagToAdd(tag: Tag) {
    if (this.addLocked) {
      return;
    }
    this.deleteLocked = true;
    if (!this.tagsToAdd) {
      this.tagsToAdd = [];
    }
    this.tagsToAdd.push(tag);
    this.unCatTagList = this.unCatTagList
      .filter(p => p !== tag);
    this.showToAdd = true;
  }

  selectTagToRemove(tag: Tag) {
    if (this.deleteLocked) {
      return;
    }
    this.addLocked = true;
    if (!this.tagsToRemove) {
      this.tagsToRemove = [];
    }
    this.tagsToRemove.push(tag);
    this.categoryTags = this.categoryTags
      .filter(p => p !== tag);
    this.showToRemove = true;
  }

  removeFromTagsToAdd(tag: Tag) {
    this.tagsToAdd = this.tagsToAdd
      .filter(p => p !== tag);
    if (this.tagsToAdd.length == 0) {
      this.showToAdd = false;
    }
  }

  removeFromTagsToRemove(tag: Tag) {
    this.tagsToRemove = this.tagsToRemove
      .filter(p => p !== tag);
    if (this.tagsToRemove.length == 0) {
      this.showToRemove = false;
    }
  }

  removeAllTagsFromCategory() {
    var idlist = this.tagsToRemove.map(t => t.tag_id);
    var listofids = idlist.join(",");
    this.listLayoutService
      .removeTagsFromLayoutCategory(this.listLayout.layout_id, this.selectedCategory.category_id, listofids)
      .subscribe(p => this.refreshForCategory());
  }

  addAllTagsToCategory() {
    var idlist = this.tagsToAdd.map(t => t.tag_id);
    var listofids = idlist.join(",");
    this.listLayoutService
      .addTagsToLayoutCategory(this.listLayout.layout_id, this.selectedCategory.category_id, listofids)
      .subscribe(p => this.refreshForCategory());
  }

  clearAllTagsToRemove() {
    this.categoryTags = this.categoryTags.concat(this.tagsToRemove);
    this.tagsToRemove = [];
    this.showToRemove = false;
  }

  clearAllTagsToAdd() {
    this.unCatTagList = this.unCatTagList.concat(this.tagsToAdd);
    this.tagsToAdd = [];
    this.showToAdd = false;
  }

  private retrieveCategoryTags(category_id: string) {

    this.tagService
      .getTagsForLayoutCategory(this.listLayout.layout_id, category_id)
      .subscribe(p => this.categoryTags = p);
  }
}
