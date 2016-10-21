
import ProjectLayout from '/imports/client/layout/project_layout.js';
import DynamicMenu from '/imports/client/dynamic_menu.js';

export default ProjectController = RouteController.extend({
  layoutTemplate: 'ProjectLayout',

  onBeforeAction: function () {
    // do some login checks or other custom logic
    this.next();
  },

  waitOn: function() {
    return [
      Meteor.subscribe('project-single-basic', this.params.projectId)
    ];
  },

  data: function() {
    return Projects.findOne({ _id:this.params.projectId });
  },

  action: function() {

    const project = this.data();

    this.render('DynamicMenu', {
      to:'leftMenuBar',
      data: project
    });
    this.render();
  }
});
