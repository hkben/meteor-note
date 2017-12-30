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

  openDraft(){
      this.props.callback(this.props.id);
  }

  getTitle( string ) {

    let title = string.split( '\n' )[ 0 ];

    title = title? title : "<Empty>";

    return title;
  }


  render() {
      return (
        <a class="item" onClick={this.openDraft.bind(this)}>
          { !this.props.content? ( "<Empty>" ) : this.getTitle(this.props.content) }
        </a>
      );
    }
  }
