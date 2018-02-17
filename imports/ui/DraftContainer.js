import React from 'react';
import { Meteor } from 'meteor/meteor';
import { withTracker } from 'meteor/react-meteor-data';

import { Drafts } from '../api/drafts.js';


class DraftContainer extends React.Component {

  constructor( props ) {
    super( props );

    this.state = {
      // pinnedDrafts: [],
      // otherDrafts: [],
      init: false,
      infoCache: []
    };
  }

  componentWillMount() {
    // let target_draft = Drafts.findOne( this.props.id );
    // this.state.draft = target_draft;
    // temp name list
  }

  componentWillReceiveProps( props ) {
    // for loop and find in this.state , if title => title to new list
  }

  openDraft( draftID ){
      this.props.callback( draftID );
  }

  renderList(pinned) {

    let drafts = pinned ? this.props.pinnedDrafts : this.props.otherDrafts;

    if(!drafts){return false;}

    return drafts.map((draft) => {

      let draftInfo = this.getDraftInfo( draft );

      return (
        <a class="item" key={draft._id} onClick={this.openDraft.bind(this, draft._id)}>
          <h4 class="ui inverted header">
            { draftInfo.title }
          </h4>
          { moment(draftInfo.changeAt).fromNow() }
        </a>
      );
    });

  }


  getDraftInfo( draft ) { // from this.state.infoCache or from db

    let infoCache = this.state.infoCache;

    let target_draft = infoCache.find( ( o ) => o._id === draft._id );

    if ( !target_draft || ( draft.changeAt != target_draft.changeAt) ) { // or changAt changed
      target_draft = Drafts.findOne( draft._id, { fields: { text: 1, changeAt: 1 } } );
      target_draft.title = this.getTitle(target_draft.text);
      delete target_draft.text; // We don't need text
      this.state.infoCache = this.state.infoCache.concat( target_draft );
    }

    return {
      title: target_draft.title,
      changeAt: target_draft.changeAt
    };

  }

  getTitle( text ) {
    let title = text.split( '\n' )[ 0 ];
    title = title ? title : "< Empty >";
    return title;
  }

  render() {
    console.log("render-DraftContainer");
    return (
      <div class="draftContainer">
      <div class="header item">
        <div class="ui teal label">{this.props.pinnedDrafts.length}</div>
        Pinned
      </div>
        { this.renderList(true) }
      <div class="header item">Others</div>
        { this.renderList(false) }
      </div>

    );

  }

}

export default withTracker( props => {
  // console.log("withTracker" , props);

  const otherDrafts = Drafts.find({ pinned: false }, { fields: { changeAt: 1 } , sort: { changeAt: -1 } }).fetch();
  const pinnedDrafts = Drafts.find({ pinned: true }, { fields: { changeAt: 1 } , sort: { changeAt: -1 } }).fetch();
  // let otherDrafts = props.otherDrafts;
  // let pinnedDrafts = props.pinnedDrafts;

  return {
    otherDrafts,
    pinnedDrafts
  };
})(DraftContainer);
