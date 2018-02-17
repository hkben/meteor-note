import React from 'react';
import { Meteor } from 'meteor/meteor';
import { withTracker } from 'meteor/react-meteor-data';

import { Drafts } from '../api/drafts.js';


class TagContainer extends React.Component {

  constructor( props ) {
    super( props );

    // this.state = {
    //   draft: null,
    //   tags: []
    // };
  }

  componentWillMount() {
    // this.state.draft = this.props.draft;
    // this.state.tags = this.props.tags;
  }

  componentWillReceiveProps( props ) {
    // this.state.draft = props.draft;
    // this.state.tags = props.tags;
  }

  renderTags() {
    return this.props.tags.map((tag) => {
      return (
          <a class="ui tag label" key={tag}>
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

      Meteor.call( 'drafts.addTag', this.props.draft , event.target.value );
      event.target.value = "";
    }
  };

  removeTag(tag) {
      Meteor.call( 'drafts.removeTag', this.props.draft  , tag );
  };

  render() {
    if ( this.props.draft ) {
      return (
        <div>
          <div class="ui icon input">
            <input placeholder="Tags..." type="text" onKeyPress={this.addTag.bind(this)} />
            <i class="tags icon"></i>
          </div>
          { this.renderTags() }
        </div>
      );
    }else{
      return null;
    }
  };
}

export default withTracker( props => {
  // Call every time before render

  console.log("withTracker - TagContainer " , props);

  let tags = props.draft ? Drafts.findOne(props.draft, { fields: { tags: 1 } }).tags : [];

  return {
    tags
  };
})(TagContainer);
