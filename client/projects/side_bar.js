import { Template } from 'meteor/templating';

import './side_bar.html';

Template.side_bar.onCreated( function() {
});


Template.side_bar.helpers({
  items: function() {
    return this || [];
  }
});
