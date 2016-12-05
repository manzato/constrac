import { Template } from 'meteor/templating';
import './quotes.html';

const openModal = function(template) {
  const modalDom = template.$('#newItem');

  const projectId = template.data._id;

  Materialize.updateTextFields();

  modalDom.openModal();
};

Template.ProjectQuotes.onCreated( function() {
  const projectId = this.data._id;

  this.subscribe('project-quotes', projectId);
});

Template.ProjectQuotes.events({
  'click .new-item': function(evt, template) {
    const modalDom = template.$('#newItem');

    $('#label', modalDom).val('');
    $('#description', modalDom).val('');
    $('#start', modalDom).pickadate('picker').set('select', start);

    openModal(template);

    $('#label', modalDom).focus();
  }
});

Template.ProjectQuotes.helpers({
  items: function() {
    return Quotes.find({ project_id:this._id }, { sort:{ finish:1 }});
  }
});
