import { Meteor } from 'meteor/meteor';
import MainLayout from '/imports/client/layout/main.js';

Router.configure({
  //title: generateTitle(),
  layoutTemplate: 'MainLayout'
});

Router.route('/', {
  name: 'Home'
});

Router.route('/logout', {
  name: 'Logout',
  action: function() {
    Meteor.logout( ()=> {
      Router.go('/');
    });
    this.next();
  }
});

Router.route('/projects/', {
  name: 'ProjectList'
});

Router.route('/projects/:projectId/info', {
  name: 'ProjectInfo'
});

Router.route('/projects/:projectId/progress-reports', {
  name: 'ProgressReports'
});

Router.route('/projects/:projectId/tasks', {
  name: 'ProjectTasks'
});

Router.route('/projects/:projectId/quotes', {
  name: 'ProjectQuotes'
});

Router.route('/projects/:projectId/quotes/:_id', {
  name: 'QuoteEdit'
});
