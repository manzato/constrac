import { Template } from 'meteor/templating';
import './project_list.html';

Template.project_list.onCreated( function() {
  this.subscribe('projects-all');
});

Template.project_list.helpers({
  projects: () => {
    return Projects.find({});
  },
  projectProgress() {
    return Math.round(this.progress) + "%";
  }
});
