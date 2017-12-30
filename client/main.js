import React from 'react';
import { Meteor } from 'meteor/meteor';
import { render } from 'react-dom';

import App from '../imports/ui/App.js';
// import '../imports/style/pure-min.css'
import '../node_modules/draft-js/dist/Draft.css'

Meteor.startup(() => {


  render(<App />, document.getElementById('render-target'));

});
