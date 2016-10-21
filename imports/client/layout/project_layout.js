
import { Template } from 'meteor/templating';

import './project_layout.html';

Template.ProjectLayout.onCreated( function() {
  //if (FlowRouter.getParam("projectId")) {
  //  this.subscribe('project-label', FlowRouter.getParam("projectId"));
  //}
});

Template.ProjectLayout.onRendered( function() {
  this.$(".dropdown-button").dropdown();
});

Template.ProjectLayout.helpers({
  isAuthenticated() {
    return Meteor.user() ? true:false;
  },
  projectLabel() {
    //if (FlowRouter.getParam("projectId")) {
    //  const project = Projects.findOne({_id:FlowRouter.getParam("projectId")});

    //  return project && project.label;
    //}
  }
});
