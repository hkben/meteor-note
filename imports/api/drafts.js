import {
  Mongo
} from 'meteor/mongo';
import {
  check
} from 'meteor/check';

export const Drafts = new Mongo.Collection( 'drafts' );

if ( Meteor.isServer ) {
  Meteor.publish( "drafts", function() {
    console.log( Drafts.find() );
    return Drafts.find();
  } );
}

Meteor.methods( {
  'drafts.insert' () {
    // check(text, String);

    // Make sure the user is logged in before inserting a task
    // if (! this.userId) {
    //   throw new Meteor.Error('not-authorized');
    // }

    let id = Drafts.insert( {
      text: "",
      tags: [],
      changeAt: new Date(),
      createdAt: new Date()
    } );

    // return id;
  },

  'drafts.update' ( objId, text ) {
    check( objId, String );
    check( text, String );

    // const task = Tasks.findOne(taskId);

    // Make sure only the task owner can make a task private
    // if (task.owner !== this.userId) {
    //   throw new Meteor.Error('not-authorized');
    // }

    Drafts.update( objId, {
      $set: {
        text,
        changeAt: new Date()
      }
    } );
  },


  'drafts.remove' ( objId ) {
    Drafts.remove( objId );
  },

  'drafts.addTag' ( objId , tag ) {
    // check( objId, String );
    // check( tag, String );

    Drafts.update( objId, {
      $push: {
        tags: tag
      }
    } );
  },

  'drafts.removeTag' ( objId , tag ) {
    // check( objId, String );
    // check( tag, String );

    Drafts.update( objId, {
      $pull: {
        tags: tag
      }
    } );
  },

} );
