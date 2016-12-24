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
    const project = Projects.findOne({ _id:projectId });

    return project.getTopLevelTasks().fetch();
  }
});
