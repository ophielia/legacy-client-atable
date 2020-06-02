import {ITag, Tag} from "../model/tag";
import TagType from "../model/tag-type";


export class TagTree {
  public static  BASE_GROUP = "0";
  private _lookupDisplay = new Map<string, ITag>();
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
        existingRelation.tag_id = tag.tag_id;
        existingRelation.assign_select = tag.assign_select;
        existingRelation.search_select = tag.search_select;
      } else {
        var node = new TagTreeNode(tag.tag_id, tag.tag_type, tag.assign_select, tag.search_select);
        this._lookupRelations.set(tag.tag_id, node);
      }
      // add to parent
      this.addTagToParentNode(tag);
    }

    // fill in base tag display
    var baseDisplay = this._lookupDisplay.get(TagTree.BASE_GROUP);
    if (!baseDisplay) {
      baseDisplay =new Tag();
    }
    baseDisplay.name = "All";
  }

  private addTagToParentNode(tag: ITag) {
    let parentId = tag.parent_id;

    // pull parent node
    var parent = this._lookupRelations.get(parentId);
    if (!parent) {
      // doesn't exist - make node with dummy values
      parent = new TagTreeNode("", "", false, false);
    }
    // add child tag
    parent.children.push(tag.tag_id);
    // set node in dictionary
    this._lookupRelations.set(parentId, parent);

  }


  navigationList(tagId: string): ITag[] {
    // navigation list
    var returnList: ITag[] = [];

    var navDisplay = this._lookupDisplay.get(tagId);
    if (!navDisplay) {
      return returnList;
    }

    if (tagId == TagTree.BASE_GROUP) {
      returnList.push(navDisplay);
      return returnList;
    }

    var parentId = navDisplay.tag_id
    var safety = 0;
    do {
      // get the node of parent id
      let parentDisplay = this._lookupDisplay.get(parentId);
      if (parentDisplay) {
        returnList.unshift(parentDisplay);// add the display at the beginning of the array

        // set the parent id
        parentId = parentDisplay.parent_id;

      }
      safety++;

    }
    while (safety < 50 && parentId != "0");

    return returnList;
  }


  allContentList(id: string, isAbbreviated: Boolean, groupsOnly: boolean, tagTypes: TagType[]): ITag[] {
    let requestedNode = this._lookupRelations[id];
    if (!requestedNode) {
      return [];
    }

    if (id == TagTree.BASE_GROUP) {
      return this.baseContentList(isAbbreviated, groupsOnly, tagTypes);
    }

// gather all tags belonging to id
    var allTags = this.allTags(requestedNode);

    return this.nodesToDisplays(allTags, groupsOnly);
  }

  directContentList(id: string, isAbbreviated: Boolean, groupsOnly: boolean, tagTypes: TagType[]): ITag[] {
    let requestedNode = this._lookupRelations[id];
    if (!requestedNode) {
      return [];
    }


    // gather all tags belonging to id
    var allTags = requestedNode.children
      .map( id => this._lookupRelations.get(id))
      .filter( node => tagTypes.indexOf(node.tag_type) >= 0);

    return this.nodesToDisplays(allTags, groupsOnly);
  }

  private allTags(node: TagTreeNode): TagTreeNode[] {
    var allOfThem: TagTreeNode[] = [];
    for (var i = 0; i < node.children.length; i++) {
      var childNodeId = node.children[i];
      var childNode = this._lookupRelations.get(childNodeId);
      allOfThem.push(childNode);
      if (childNode.isGroup()) {
        allOfThem = allOfThem.concat(this.allTags(childNode));
      }

    }
    return allOfThem;
  }

  private baseContentList(isAbbreviated: Boolean, groupsOnly: boolean, tagTypes: TagType[]): ITag[] {
    var baseNode = this._lookupRelations.get(TagTree.BASE_GROUP);
    if (!baseNode) {
      return [];
    }

    var filteredChildren: TagTreeNode[] = [];
    for (var i = 0; i < baseNode.children.length; i++) {
      var childId = baseNode.children[i];
      var childNode = this._lookupRelations.get(childId);
      if (!childNode) {
        continue;
      }
      var childNodeMatch = tagTypes.indexOf(baseNode.tag_type) >= 0;
      var groupEligible = !groupsOnly || (groupsOnly && baseNode.isGroup());

      if (childNodeMatch && groupEligible) {
        filteredChildren.push(childNode);
      }
    }
    return this.nodesToDisplays(filteredChildren, groupsOnly);
  }


  private nodesToDisplays(nodes: TagTreeNode[], groupsOnly: boolean) {
    // put into set
    var allTagSet = new Set<TagTreeNode>();
    nodes.forEach(tagNode => {
      allTagSet.add(tagNode);
    });

    // separate into childTags and childGroups (displays)
    var childTags: ITag[] = [];
    var childGroups: ITag[] = [];
    for (let node of allTagSet) {
      var nodeId = node.tag_id;
      var display = this._lookupDisplay.get(nodeId);
      if (!display) {
        continue;
      }
      if (node.isGroup()) {
        childGroups.push(display);
      } else if (!groupsOnly) {
        childTags.push(display);
      }
    }

    // append both arrays together
    childTags.sort((a, b) => {
      return a.name.toLocaleLowerCase().localeCompare(b.name.toLocaleLowerCase());
    });
    childGroups.sort((a, b) => {
      return a.name.toLocaleLowerCase().localeCompare(b.name.toLocaleLowerCase());
    });

    return childGroups.concat(childTags);

  }
}


export class TagTreeNode {
  tag_id: string;
  tag_type: TagType;
  assign_select: boolean;
  search_select: boolean;
  children: string[] = [];


  constructor(tag_id: string,
              tag_type: string,
              assign_select: boolean,
              search_select: boolean) {
    this.tag_type = tag_type;
    this.assign_select = assign_select;
    this.search_select = search_select;
  }


  isGroup(): boolean {
    return this.children && this.children.length > 0;
  }
}
