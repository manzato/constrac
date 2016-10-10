
import { Meteor } from 'meteor/meteor';
import MainLayout from '/imports/client/layout/main.js';

FlowRouter.route('/', {
  name: 'home',
  action: function() {
    BlazeLayout.render("MainLayout", {content: "home"});
  }
});

FlowRouter.route('/logout', {
  name: 'logout',
  action: function() {
    Meteor.logout(() => {
      FlowRouter.go('home');
    });
  }
});

/* Projects */

const projectsSection = FlowRouter.group({
    prefix: "/projects"
});

projectsSection.route('/', {
  action: function() {
    BlazeLayout.render("MainLayout", { content: "project_list" });
  }
});

projectsSection.route('/:projectId', {
  action: function() {
    BlazeLayout.render("MainLayout", { content: "project" });
  }
});

projectsSection.route('/:projectId/info', {
  action: function() {
    BlazeLayout.render("MainLayout", { content: "project_info" });
  }
});

projectsSection.route('/:projectId/progress-reports', {
  action: function() {
    BlazeLayout.render("MainLayout", { content: "progress_reports" });
  }
});

projectsSection.route('/:projectId/tasks', {
  action: function() {
    BlazeLayout.render("MainLayout", { content: "project_tasks" });
  }
});
/*


this.route('project', {
  path: '/projects/:_id',
  title: generateTitle('Project')
});
Router.configure({
  title: generateTitle(),
  layoutTemplate: 'BasicLayout'
});

Router.map( function () {
  this.route('home', {
    path: '/'
  });

  this.route('project', {
    path: '/projects/:_id',
    title: generateTitle('Project')
  });
});
*/
