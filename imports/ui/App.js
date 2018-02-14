import React from 'react';
import { withTracker } from 'meteor/react-meteor-data';

import { Drafts } from '../api/drafts.js';

import CustomEditor from './CustomEditor.js';

import Draft from './Draft.js';

class App extends React.Component {

  constructor( props ) {
    super( props );

    this.state = {
      // text: null,
      // preview: null,
      // viewMode: 0,
      draftsID: null,  // todo : Change name?
      init: true,
      note: null
    };
  }

  componentWillReceiveProps( props ) {
    let lastDraft = props.drafts[ 0 ];

    if(!lastDraft){
      lastDraft = props.pinned[ 0 ];
    }

    if ( !lastDraft ) {
      this.setState( {
        draftsID: null
      } );
      return false;
    }

    if ( lastDraft._id != this.state.draftsID && this.state.init ) {
      // console.log(lastDraft);
      // this.draftStateUpdate( lastDraft );
      this.state.init = false;

      this.setState( {
        draftsID: lastDraft._id
      } );


    }
  }

  openDraft( draftsID ) { // Open and Get Note Object from DB

    this.setState( {
      draftsID: draftsID
    } );

  }

  renderTasks(pinned) {
    let drafts;

    if(pinned){
      drafts = this.props.pinned;
    }else {
      drafts = this.props.drafts;
    }

    if(!drafts){return false;}

    return drafts.map((draft) => {
      // const currentUserId = this.props.currentUser && this.props.currentUser._id;
      // const showPrivateButton = task.owner === currentUserId;

      return (
        <Draft
          key={draft._id}
          id={draft._id}
          callback={this.openDraft.bind(this)}
        />
      );
    });
  }

  renderEditor() {

    if ( !this.state.draftsID ) {
      return ( <div> Create a New Drafts! </div>);
    }else{
      return ( < CustomEditor draftsID={this.state.draftsID} />);
    }
  }

  addDraft() {
    let id = new ReactiveVar();

    Meteor.call( 'drafts.insert' );

    this.state.init = true;

    // this.setState( {
    //   draftsID: id.get()
    // } );
  };

  deleteDraft() {
    Meteor.call( 'drafts.remove', this.state.draftsID );

    this.state.init = true;
  };

  pinDraft() {
    Meteor.call( 'drafts.pin', this.state.draftsID );
  };

  renderTagBar() {
    if ( this.state.draftsID ) {
      return (
        <div>
          <div class="ui icon input">
            <input placeholder="Tags..." type="text" onKeyPress={this.addTag.bind(this)} />
            <i class="tags icon"></i>
          </div>
          {this.renderTags()}
        </div>
      );
    }
  };

  renderTags() {

    let draft = Drafts.findOne( {
      _id: this.state.draftsID
    } );

    return draft.tags.map((tag) => {

      return (
        <a class="ui tag label">
          {tag}
          <i class="delete icon" value={tag} onClick={this.removeTag.bind(this, tag)}></i>
        </a>
      );
    });
  };

  addTag( event ) {
    if ( event.key === 'Enter' ) {
      event.preventDefault();

      if(!event.target.value){ return false; }

      Meteor.call( 'drafts.addTag', this.state.draftsID , event.target.value );
      event.target.value = "";
    }
  };

  removeTag(tag) {
      Meteor.call( 'drafts.removeTag', this.state.draftsID  , tag );
  };

  render() {
    // console.log("render" , this.state.draftsID);
    return (
        <div id="content" class="ui vertically padded grid">
          <div id="sidebar" class="ui left vertical menu inverted three wide column">
            <div class="item">
            <h1>Drafts</h1>
            </div>
            <div class="item">
              <button class="ui primary button" onClick={this.addDraft.bind(this)} >Add</button>
            </div>
            <div class="header item">Sort By</div>
            <div class="header item">
              <div class="ui teal label">{this.props.pinned.length}</div>
              Pinned
            </div>
            {this.renderTasks(true)}
            <div class="header item">Others</div>
                {/*}<li class="pure-menu-item"><a href="#" class="pure-menu-link">test</a></li>
                <li class="pure-menu-item"><a href="#" class="pure-menu-link">test</a></li>
                <li class="pure-menu-item"><a href="#" class="pure-menu-link">test</a></li>*/}
            {this.renderTasks(false)}
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
              <a class="item">
                Messages
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
              {this.renderTagBar()}
            </div>

          </div>
        </div>
    );
  }

}

// Lazy Load
export default withTracker(() => {
  return {
    drafts: Drafts.find({ pinned: false }, { fields: { _id: 1 } , sort: { createdAt: -1 } }).fetch(),
    pinned: Drafts.find({ pinned: true }, { fields: { _id: 1 } , sort: { createdAt: -1 } }).fetch(),
  };
})(App);
