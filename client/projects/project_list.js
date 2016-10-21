import { Template } from 'meteor/templating';
import './project_list.html';

Template.ProjectList.onCreated( function() {
  this.subscribe('projects-all');
});

Template.ProjectList.helpers({
  projects: () => {
    return Projects.find({});
  },
  projectProgress() {
    return Math.round(this.progress) + "%";
  }
});
