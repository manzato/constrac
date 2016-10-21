import { Template } from 'meteor/templating';
import { ReactiveVar } from 'meteor/reactive-var';

import './project_tasks.html';

Template.ProjectTasks.onCreated(function() {
  const projectId = this.data._id;

  this.subscribe('project-single', projectId);
  this.subscribe('project-top-tasks', projectId);
});

Template.ProjectTasks.helpers({
  projectTasks: function() {
    const projectId = this._id;
    const project = Projects.findOne({ _id:projectId }, {
      fields: { tasks:1 }
    });

    const tasks = (project && project.tasks) || [];

    return _.sortBy(_.map(tasks, (taskId) => {
      return Tasks.findOne({_id:taskId});
    }), 'code');
  },
  side_bar_items: () => {
    return [
      {label:'Detalles', url:'info'},
      {label:'Reportes diarios', url:'progress-reports'},
      {label:'Tareas', url:'tasks', active:true}
    ];
  }
});
