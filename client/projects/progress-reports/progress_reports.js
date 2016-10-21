import { Template } from 'meteor/templating';
import './progress_reports.html';

Template.ProgressReports.onCreated( function() {
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


Template.ProgressReports.onRendered( function() {
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

Template.ProgressReports.events({
  'click .new-report': function(evt, template) {
    console.log('new report');
    openModal(template);
  }
});

Template.ProgressReports.helpers({
  reports: function() {
    return ProgressReports.find({ project_id:this._id }, { sort:{ finish:1 }});
  },
  side_bar_items: () => {
    return [
      {label:'Detalles', url:'info'},
      {label:'Reportes diarios', url:'progress-reports', active:true},
      {label:'Tareas', url:'tasks'}
    ];
  }
});
