import { Template } from 'meteor/templating';
import './progress-reports.html';

Template.progress_reports.onCreated( function() {
  const projectId = FlowRouter.getParam("projectId");
  this.subscribe('project-single', projectId);
});

Template.progress_reports.onRendered( function() {
  this.$('.modal-trigger').leanModal();
});

Template.progress_reports.helpers({
  projects: () => {
    return Projects.find({});
  },
  crumbs: () => {
    return [{
      label: 'dd',
      url: 'dde'
    }];
  },
  project_name: () => {
    return 'project_name';
  },
  side_bar_items: () => {
    return [
      {label:'Detalles', url:'info'},
      {label:'Reportes diarios', url:'progress-reports', active:true},
      {label:'Tareas', url:'tasks'}
    ];
  }
});
