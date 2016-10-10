
import { Template } from 'meteor/templating';

import './main.html';

Template.MainLayout.onCreated( function() {
  if (FlowRouter.getParam("projectId")) {
    this.subscribe('project-label', FlowRouter.getParam("projectId"));
  }
});

Template.MainLayout.onRendered( function() {
  this.$(".dropdown-button").dropdown();
});

Template.MainLayout.helpers({
  isAuthenticated() {
    return Meteor.user() ? true:false;
  },
  projectLabel() {
    if (FlowRouter.getParam("projectId")) {
      const project = Projects.findOne({_id:FlowRouter.getParam("projectId")});

      return project && project.label;
    }
  }
});
