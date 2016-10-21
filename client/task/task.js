import { Template } from 'meteor/templating';
import { ReactiveVar } from 'meteor/reactive-var';

import './task.html';

Template.task.onCreated( function() {
  this.isOpen = new ReactiveVar((this.data.level === 0)); //Only open first level initially
  const template = this;
  const task = template.data;

  task.on('open', () => {
    template.subscribe('task-childs', task._id, {
      onReady: function() {
        //TODO: Pre-load tasks from the next level!!
      }
    });
  });

  if (task.level === 0) {
    task.open();
  }
});

Template.task.onRendered( function() {

});

Template.task.helpers({
  taskProgress() {
    return Math.round(this.progress) + "%";
  }
});

Template.task.events({
  'click .open'(event, template) {
    const task = template.data;

    task.open();
    return false;
  },
  'click .close'(event, template) {
    const task = template.data;

    task.close();
    return false;
  }
});

/***************************************************************/
Template.tasks.helpers({
  tasks() {
    return this;
  //  return _.sortBy(this, function(task) {
  //      console.log(task);
  //      return task && task.code;
  //  });
  }
});
