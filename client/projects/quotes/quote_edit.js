import { Template } from 'meteor/templating';
import { ReactiveVar } from 'meteor/reactive-var';
import { Tracker } from 'meteor/tracker';

import './quote_edit.html';

Template.QuoteEdit.onCreated( function() {
  const controller = Iron.controller();
  const quoteId = controller.params._id;
  const project = this.data;
  this.subscribe('project-quote', project._id, quoteId);
  this.subscribe('project-quote-items', project._id, quoteId);
  this.subscribe('project-single', project._id);
  this.subscribe('project-top-tasks', project._id);

});

Template.QuoteEdit.helpers({
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

  quoteItems: function() {
    return QuoteItems.find();
  }
});
