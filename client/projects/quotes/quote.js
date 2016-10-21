import { Template } from 'meteor/templating';
import './quote.html';

Template.ProjectQuotes.onCreated( function() {
  const projectId = this.data._id;

  this.subscribe('project-single', projectId);
});

const openModal = function(template) {
  const modalDom = template.$('#newProgressReport');

  const projectId = template.data._id;

  const lastReport = ProgressReports.findOne({ project_id:projectId }, {
    sort:{ finish:-1 },
    fields: { finish:1 }
  });

  let start;
  if (lastReport) {
    start = lastReport.finish;
    start.setDate(start.getDate() + 1);
  } else {
    start = Projects.findOne({ _id:projectId }, { fields:{ startedAt:1 }}).startedAt;
  }
  const finish = new Date();

  $('#label', modalDom).val('' + (ProgressReports.find({
    project_id:projectId
  }).count() + 1));
  $('#description', modalDom).val('');
  $('#start', modalDom).pickadate('picker').set('select', start);
  $('#finish', modalDom).pickadate('picker').set('select', finish);

  Materialize.updateTextFields();

  modalDom.openModal();
};


Template.ProjectQuotes.onRendered( function() {
  const template = this;
  const projectId = template.data._id;

  this.subscribe('project-progress-reports', projectId, {
    onReady: () => {
      Meteor.setTimeout(function() {
        //openModal(template);

      }, 100);
    }
  });
});

Template.ProjectQuotes.events({
  'click .new-report': function(evt, template) {
    console.log('new report');
    openModal(template);
  }
});

Template.ProjectQuotes.helpers({
  items: function() {
    return Quotes.find({ project_id:this._id }, { sort:{ finish:1 }});
  }
});
