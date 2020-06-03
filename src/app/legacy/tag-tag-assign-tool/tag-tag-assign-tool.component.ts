import {Component, OnDestroy, OnInit} from '@angular/core';
import {ITag} from "../../model/tag";
import {TagsService} from "../../services/tags.service";
import {ActivatedRoute} from "@angular/router";
import TagType from "../../model/tag-type";
import {TagDrilldown} from "../../model/tag-drilldown";
import {TagCommService} from "../drilldown/tag-drilldown-select.service";
import TagSelectType from "../../model/tag-select-type";
import {TagTreeService} from "../../services/tagtree.service";
import {ContentType, TagTree} from "../../services/tagtree.object";
import {Subscription} from "rxjs/Subscription";

@Component({
  selector: 'at-tag-tag-assign-tool',
  templateUrl: './tag-tag-assign-tool.component.html',
  styleUrls: ['./tag-tag-assign-tool.component.css']
})
export class TagTagAssignToolComponent implements OnInit, OnDestroy {
  hopperTags: ITag[];
  doShowAddTag: boolean = false;
  currentTagType: string = TagType.Rating;
  tagTypeList: string[] = TagType.listAll();
  selectedTag: ITag;
  selectedParentTagId: string = "0";
  parentTags: ITag[];
  public showToAdd: boolean = false;
  createNewGroupFlag: boolean = false;
  currentSelectType: string = TagSelectType.All;
  categoryTags: ITag[];
  tagsToAdd: ITag[];
  private editTagList: TagDrilldown[];
  private errorMessage: string;
  public loading: boolean = false;
  unsubscribe: Subscription[] = [];

  private layoutId: string;
  private addLocked: boolean = true;
  editTag: ITag;

  navigationList: ITag[];
  contentList: ITag[];

  constructor(private tagCommService: TagCommService,
              private tagService: TagsService,
              private tagTreeService: TagTreeService,
              private route: ActivatedRoute) {
    this.layoutId = this.route.snapshot.params['id'];
  }

  ngOnInit() {
    this.editTagList = [];
    this.categoryTags = [];
    this.retrieveParentTags();
    this.fillTagTreeLists(TagTree.BASE_GROUP, this.currentTagType);
  }

  ngOnDestroy() {
    this.unsubscribe.forEach(s => s.unsubscribe());
  }


  retrieveParentTags() {
    this.parentTags = [];
    this.loading = false;
    this.tagService
      .getAllParentTags(this.currentTagType)
      .subscribe(p => {
          p.sort((a, b) => {
            if (a.name < b.name) return -1;
            else if (a.name > b.name) return 1;
            else return 0;
          });
        this.parentTags = p;
          this.loading = false;
        },
        e => this.errorMessage = e);
  }

  selectEditTag(tag: ITag) {
    this.showToAdd = true;
    if (!this.hopperTags) {
      this.hopperTags = [];
    }
    this.hopperTags.push(tag);
  }

  navigateTags(tagId: string) {
    this.selectedParentTagId = tagId;
    this.fillTagTreeLists(tagId, this.currentTagType);
  }


  selectAssignTag(tag: ITag) {
    this.selectedTag = tag;
    this.addLocked = false;
  }


  clearAllTagsToAdd() {
    this.hopperTags = [];
    this.showToAdd = false;
    this.editTag = null;
  }

  addAllTagsToSelected() {
    this.showToAdd = false;
    this.loading = true;
    var addTags = this.hopperTags;
    this.hopperTags = [];
    this.editTagList = [];
    var listofids = addTags.map(t => t.tag_id);
    var idstring = listofids.join(",");

    this.tagService
      .assignTagsToTag(this.selectedTag.tag_id, idstring)
      .subscribe(() => {
        this.tagTreeService.refreshTagTree();
        this.fillTagTreeLists(this.selectedParentTagId, this.currentTagType)
        this.retrieveParentTags();
      });
  }

  moveToBaseTag() {
    this.showToAdd = false;
    this.loading = true;
    this.tagService
      .assignTagsToBaseTag(this.hopperTags)
      .subscribe( () => {
        this.tagTreeService.refreshTagTree();
        this.fillTagTreeLists(this.selectedParentTagId, this.currentTagType);
        this.retrieveParentTags();
      });
    this.hopperTags = [];
  }

  createNewGroup() {
    this.createNewGroupFlag = true;
  }

  changeTagType(tagtype: string) {
    this.currentTagType = tagtype;
    this.fillTagTreeLists(TagTree.BASE_GROUP, this.currentTagType);
    this.retrieveParentTags()
    this.hopperTags = [];
  }

  addTagsToNewGroup(newgroup: string) {
    this.createNewGroupFlag = false;
    var tagsToAdd = this.hopperTags;
    this.hopperTags = [];

    let $newtag = this.tagService.addTag(newgroup, this.currentTagType);

    $newtag.subscribe(r => {
      var headers = r.headers;
      var location = headers.get("Location");
      var splitlocation = location.split("/");
      var id = splitlocation[splitlocation.length - 1];
      var listofids = tagsToAdd.map(t => t.tag_id).join(",");
      this.tagService.assignTagsToTag(id, listofids)
        .subscribe(() => {
          this.retrieveParentTags();
          this.tagTreeService.refreshTagTree();
          this.fillTagTreeLists(this.selectedParentTagId, this.currentSelectType);
        })
      ;
    });

  }

  removeFromTagsToAdd(tag: ITag) {
    this.hopperTags = this.hopperTags
      .filter(p => p !== tag);
    if (this.tagsToAdd.length == 0) {
      this.showToAdd = false;
    }
  }

  editTagName(tag: ITag) {
    // set the editTag variable
    this.editTag = tag;
  }

  saveTagNameEdit(tagname: string) {
    var updateTag: ITag = this.editTag;
    this.editTag = null;
    updateTag.name = tagname;
    this.tagService.saveTag(updateTag)
      .subscribe();
    this.hopperTags.forEach(t => {
      if (t.tag_id == updateTag.tag_id) {
        t.name = updateTag.name;
      }
    })
    this.editTag = null;
  }

  showEditTag(tag_id: string) {
    if (!this.editTag) {
      return false;
    }
    return this.editTag.tag_id == tag_id;

  }

  showAddTag() {
    return this.doShowAddTag;
  }

  toggleAddTag() {
    this.doShowAddTag = !this.doShowAddTag;
  }

  addNewTag(tagname: string) {
    this.tagService.addTag(tagname, this.currentTagType)
      .subscribe(() => {
        console.log(`added!!! this.tagName`);
        this.tagTreeService.refreshTagTree();
        this.fillTagTreeLists(this.selectedParentTagId, this.currentTagType);
      });
  }


  private fillTagTreeLists(tagId: string, tagType: TagType) {
    this.loading = true;
    var $sub = this.tagTreeService.allContentList(tagId, ContentType.Direct, false, false, [tagType])
      .subscribe(tagList => {
        this.loading = false;
        this.contentList = tagList;
      });
    this.unsubscribe.push($sub);

    var $navsub = this.tagTreeService.navigationList(tagId)
      .subscribe( tagList => {
        this.loading = false;
        this.navigationList = tagList;
      });
    this.unsubscribe.push($navsub);
  }
}
