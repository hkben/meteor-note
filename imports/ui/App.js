import React from 'react';
import { withTracker } from 'meteor/react-meteor-data';

import { Drafts } from '../api/drafts.js';

import CustomEditor from './CustomEditor.js';

import DraftContainer from './DraftContainer.js';
import TagContainer from './TagContainer.js';

class App extends React.Component {

  constructor( props ) {
    super( props );

    this.state = {
      // text: null,
      // preview: null,
      // viewMode: 0,
      draftsID: null,  // todo : Change name?
      init: true,
      // note: null,
    };
  }

  componentWillReceiveProps( props ) {
    let lastDraft = props.lastDraft;

    console.log("lastDraft",lastDraft);

    if ( !lastDraft ) {
      this.setState( {
        draftsID: null
      } );
      return false;
    }

    if ( lastDraft._id != this.state.draftsID && this.state.init ) {
      // console.log(lastDraft);
      // this.draftStateUpdate( lastDraft );
      this.setState( {
        init: false,
        draftsID: lastDraft._id
      } );


    }
  }

  openDraft( draftsID ) { // Open and Get Note Object from DB

    this.setState( {
      draftsID: draftsID
    } );

  }

  renderEditor() {

    if ( !this.state.draftsID ) {
      return ( <div> Create a New Drafts! </div>);
    }else{
      return ( < CustomEditor draftsID={this.state.draftsID} callback={this.draftSaved.bind(this)} />);
    }
  }

  draftSaved() {

    // this.setState( this.state);
      return false;
  }

  addDraft() {
    // let id = new ReactiveVar();

    Meteor.call( 'drafts.insert' );

    this.state.init = true;

  };

  deleteDraft() {
    Meteor.call( 'drafts.remove', this.state.draftsID );

    this.state.init = true;

  };

  pinDraft() {
    Meteor.call( 'drafts.pin', this.state.draftsID );
  };


  render() {
    console.log("Render - App");
    // debugger;
    return (
        <div id="content" class="ui vertically padded grid">
          <div id="sidebar" class="ui left vertical menu inverted three wide column">
            <div class="item">
            <h1>Drafts</h1>
            </div>
            <div class="item">
              <button class="ui primary button" onClick={this.addDraft.bind(this)} >Add</button>
            </div>
            <div class="ui dropdown item">Sort By
            </div>

            <DraftContainer callback={this.openDraft.bind(this)} />

          </div>

          <div id="leftside" class="thirteen wide column">
            <div class="ui secondary menu">
              <div class="item">
                <div class="ui icon input">
                  <input placeholder="Search..." type="text"/>
                  <i class="search link icon"></i>
                </div>
              </div>
              <a class="active item">
                Home
              </a>
              <a class="item" onClick={this.deleteDraft.bind(this)}>
                Delete This!
              </a>

              <a class="item" onClick={this.pinDraft.bind(this)}>
                Pin This!
              </a>


              <div class="right menu">
                <a class="ui item">
                  Logout
                </a>
              </div>
            </div>

            <div id="notecontent">
              {this.renderEditor()}
            </div>

            <div id="bottombar">
              <TagContainer draft={this.state.draftsID} />
            </div>

          </div>
        </div>
    );
  }

}

// Lazy Load
export default withTracker(() => {
  console.log("withTracker - App");
  return {
    lastDraft: Drafts.findOne({ pinned: false }, { fields: { _id: 1 } , sort: { changeAt: -1 } }),
  };
})(App);
