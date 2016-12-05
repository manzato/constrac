import { Template } from 'meteor/templating';
import { ReactiveVar } from 'meteor/reactive-var';
import { Tracker } from 'meteor/tracker';

import './quote_new.html';

Template.ProjectQuotesNew.onCreated( function() {
  const self = this;
  const projectId = self.data._id;
  this.subscribe('task-childs-open', projectId);
});

Template.ProjectQuotesNew.onRendered( function() {
  this.$('.datepicker').pickadate({
    selectMonths: true, // Creates a dropdown to control month
    selectYears: false, // Creates a dropdown of 15 years to control year
    format: 'yyyy-mm-dd'
  });
});

Template.ProjectQuotesNew.events({
  'click .create': function(event, instance) {
    const projectId = instance.data._id;
    const label = instance.$('#label').val();
    const description = instance.$('#description').val();

    if (!label || label.length <= 0) {
      instance.$('#label').addClass('error');
      return;
    }

    const start = moment(instance.$('#start').val(), "YYYY-MM-DD").toDate();
    const finish = moment(instance.$('#finish').val(), "YYYY-MM-DD")
      .add(1, 'day').subtract(1, 'minute').toDate();

    Quotes.insert({
      label:label,
      description:description,
      start: start,
      project_id:projectId
    }, (err) => {
      //TODO: Handle errors
      instance.$('#newItem').closeModal();
    });
  }
});

Template.progress_report_new.helpers({
  defaultName: function() {
    //const projectId = FlowRouter.getParam("projectId");

    //return ProgressReports.find({ project_id: projectId}).count();
  }
});
