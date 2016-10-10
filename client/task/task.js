import { Template } from 'meteor/templating';
import { ReactiveVar } from 'meteor/reactive-var';

import './task.html';

Template.task.onCreated( function() {
  this.isOpen = new ReactiveVar(true);
});

Template.task.helpers({
  isOpen() {
    return Template.instance().isOpen.get();
  },
  taskProgress() {
    return Math.round(this.progress) + "%";
  }
});

Template.task.events({
  'click .open'(event, instance) {
    instance.isOpen.set(true);
    return false;
  },
  'click .close'(event, instance) {
    instance.isOpen.set(false);
    return false;
  }
});

/***************************************************************/
Template.tasks.helpers({
  tasks() {
    return this;
  }
});
