import { Template } from 'meteor/templating';
import { ReactiveVar } from 'meteor/reactive-var';
import { Tracker } from 'meteor/tracker';

import './quote_edit.html';

Template.QuoteEdit.onCreated( function() {
  const controller = Iron.controller();
  const quoteId = controller.params._id;
  const project = this.data;
  this.subscribe('project-quote', project._id, quoteId);

  Template.ProjectTasks.onCreated(function() {
    const projectId = this.data._id;

    this.subscribe('project-single', projectId);
    this.subscribe('project-top-tasks', projectId);
  });
});
