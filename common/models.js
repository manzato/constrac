import { Meteor } from 'meteor/meteor';
import addConstant from '/imports/common/utils';
import Project from '/imports/model/project';
import Quote from '/imports/model/quote';
import QuoteItem from '/imports/model/quote_item';
import Task from '/imports/model/task';

Projects = new Meteor.Collection("projects", {
  transform: function(doc) {
    return new Project(doc);
  }
});
Projects.attachBehaviour('timestampable');

Projects.before.insert(function (userId, doc) {
  if (! doc.state ) {
    doc.state = Project.STATE_CREATED;
  }
  if (! doc.deviation ) {
    doc.deviation = 0;
  }
  if (! doc.progress ) {
    doc.progress = 0;
  }
});

Tasks = new Meteor.Collection("tasks", {
  transform: function(doc) {
    return new Task(doc);
  }
});
Tasks.attachBehaviour('timestampable');

class ProgressReport {
  constructor(doc) {
    _.extend(this, doc);
  }
};

ProgressReports = new Meteor.Collection("progressReports", {
  transform: function(doc) {
    return new ProgressReport(doc);
  }
});

ProgressReports.attachBehaviour('timestampable');

Quotes = new Meteor.Collection("quotes", {
  transform: function(doc) {
    return new Quote(doc);
  }
});

Quotes.attachBehaviour('timestampable');

QuoteItems = new Meteor.Collection("quoteitems", {
  transform: function(doc) {
    return new QuoteItem(doc);
  }
});

QuoteItems.attachBehaviour('timestampable');
