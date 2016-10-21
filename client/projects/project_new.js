import { Template } from 'meteor/templating';
import { ReactiveVar } from 'meteor/reactive-var';

import './project_new.html';

Template.project_new.events({
  'click .create': function(event, instance) {
    const label = instance.$('#label').val();
    const description = instance.$('#description').val();

    if (!label || label.length <= 0) {
      instance.$('#label').addClass('error');
      return;
    }

    Projects.insert({
      label:label,
      description:description
    }, (err, projectId) => {
      instance.$('#newProjectModal').closeModal();

      Router.go(
        Router.routes['ProjectInfo'].path({ projectId:projectId })
      );
    });
  }
});

Template.project_new.helpers({
  project: function() {
    const projectId = FlowRouter.getParam("projectId");

    const project = Projects.findOne({ _id:projectId });

    if (! project) {

    }
    return project;
  }
});
