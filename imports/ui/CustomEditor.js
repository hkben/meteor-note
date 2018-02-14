import React from 'react';
import ReactDOM from 'react-dom';

import { Drafts } from '../api/drafts.js';

import {Editor, EditorState, ContentState } from 'draft-js';


export default class CustomEditor extends React.Component {
    constructor( props ) {
      super( props );

      this.state = {
        editorState: EditorState.createEmpty(),
        draftsID: null,
      };

      this.onChange = ( editorState ) => {

        this.setState( {
          editorState
        } );

        let text = editorState.getCurrentContent().getPlainText();

        console.log( this.state.draftsID , "AAA" );

        if ( this.state.draftsID ) {
          Meteor.call( 'drafts.update', this.state.draftsID, text );
        }
      };
    }


    componentWillMount() { //*******************
      this.loadDrafts( this.props.draftsID );
    }

    componentWillReceiveProps( props ) {

      if ( !props.draftsID ) {
        return false
      };

      this.loadDrafts( props.draftsID );

    }

    loadDrafts( _draftsID ) {

      if ( _draftsID != this.state.draftsID && _draftsID ) {

        let draft = Drafts.findOne( _draftsID , { fields: { text: 1 } } );

        this.state.draftsID = _draftsID;

        console.log( draft.text );

        let state = draft.text ? EditorState.createWithContent( ContentState.createFromText( draft.text ) ) : EditorState.createEmpty();

        this.setState( {
          editorState: state
        } );

      }
    }

    /*handleChange( text ) {
      console.log( "save", this.state.draftsID );
      console.log( "save", text );

      this.state.init = false;

      if ( this.state.draftsID ) {
        Meteor.call( 'drafts.update', this.state.draftsID, text );
      }
      this.renderPreview();
    }*/

  render() {
    return (
        <Editor editorState={this.state.editorState} onChange={this.onChange} />
    );
  }
}
