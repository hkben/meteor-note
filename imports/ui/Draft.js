import React, { Component } from 'react';
import { Meteor } from 'meteor/meteor';

import { Drafts } from '../api/drafts.js';

// Task component - represents a single todo item
export default class Task extends Component {
  // toggleChecked() {
  //    Set the checked property to the opposite of its current value
  //   Meteor.call('tasks.setChecked', this.props.task._id, !this.props.task.checked);
  // }

  // deleteThisTask() {
  //   Meteor.call('tasks.remove', this.props.task._id);
  // }

  // togglePrivate() {
  //   Meteor.call('tasks.setPrivate', this.props.task._id, ! this.props.task.private);
  // }

  constructor( props ) {
    super( props );
    this.state = {
      draft: null
    };
  }

  componentWillMount() {
    let target_draft = Drafts.findOne( this.props.id );
    this.state.draft = target_draft;
    // console.log(target_draft);
  }

  openDraft(){
      this.props.callback(this.props.id);
  }

  getTitle() {
    let content = this.state.draft.text;

    let title = content.split( '\n' )[ 0 ];

    title = title ? title : "< Empty >";

    return title;
  }


  render() {

      return (
        <a class="item" onClick={this.openDraft.bind(this)}>
          { this.getTitle() }
        </a>
      );
    }
  }
