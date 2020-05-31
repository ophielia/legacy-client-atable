import {ITag} from "../model/tag";


export class TagTree {
  private _lookupDisplay = new Map();
  private _lookupRelations = new Map<string, TagTreeNode>();

  constructor(tags: ITag[]) {

    for (let i = 0; i < tags.length; i++) {
      let tag = tags[i];
      // put display in _lookupDisplay (just tag info)
      this._lookupDisplay.set(tag.tag_id, tag);
      // fill in relations (nodes) in _lookupRelations
      var existingRelation = this._lookupRelations.get(tag.tag_id);
      if (existingRelation) {
        existingRelation.tag_type = tag.tag_type;
        existingRelation.assign_select = tag.assign_select;
        existingRelation.search_select = tag.search_select;
      } else {
        var node = new TagTreeNode(tag.tag_type, tag.assign_select, tag.search_select);
        this._lookupRelations.set(tag.tag_id, node);
      }
      // add to parent
      this.addTagToParentNode(tag);
    }

  }

  private addTagToParentNode(tag: ITag) {
    let parentId = tag.parent_id;

    // pull parent node
    var parent = this._lookupRelations.get(parentId);
    if (!parent) {
      // doesn't exist - make node with dummy values
      parent = new TagTreeNode("", false, false);
    }
    // add child tag
    parent.children.push(tag.tag_id);
    // set node in dictionary
    this._lookupRelations.set(parentId, parent);

  }

  // navigation list

  // content list

}


export class TagTreeNode {
  tag_type: string;
  assign_select: boolean;
  search_select: boolean;
  children: string[] = [];


  constructor(tag_type: string,
              assign_select: boolean,
              search_select: boolean) {
    this.tag_type = tag_type;
    this.assign_select = assign_select;
    this.search_select = search_select;
  }

}
