import { Template } from 'meteor/templating';
import { ReactiveVar } from 'meteor/reactive-var';

import './project_tasks.html';

Template.project_tasks.onCreated(function projectOnCreated() {
  const projectId = FlowRouter.getParam("projectId");

  this.subscribe('project-single', projectId);
  this.subscribe('project-top-tasks', projectId);
});

Template.project_tasks.helpers({
  projectTasks: function() {
    const projectId = FlowRouter.getParam("projectId");

    const project = Projects.findOne({ _id:projectId });

    const tasks = (project && project.tasks) || [];

    return _.map(tasks, (taskId) => {
      return Tasks.findOne({_id:taskId});
    });
  },
  side_bar_items: () => {
    return [
      {label:'Detalles', url:'info'},
      {label:'Reportes diarios', url:'progress-reports'},
      {label:'Tareas', url:'tasks', active:true}
    ];
  }
});
