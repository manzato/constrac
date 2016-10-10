import { Template } from 'meteor/templating';
import './home.html';

Template.home.onCreated( function() {
  this.subscribe('projects-all');
});

Template.home.onRendered( function() {
  this.$('.modal-trigger').leanModal();
});

Template.home.helpers({
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
  }
});

Template.home.events({
});
