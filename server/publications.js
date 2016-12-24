
Meteor.publish('projects-all', function() {
  return Projects.find();
});

Meteor.publish('project-label', function(id) {
  check(id, String);
  return Projects.find({ _id:id }, { fields: { label:1 }});
});

Meteor.publish('project-single', function(id) {
  check(id, String);
  return Projects.find({ _id:id });
});

Meteor.publish('project-single-basic', function(id) {
  check(id, String);
  return Projects.find({ _id:id }, { fields: { label:1, description:1, state:1 }});
});

Meteor.publish('project-top-tasks', function(id) {
  check(id, String);
  return Tasks.find({ project_id:id, parent_id:null });
});

Meteor.publish('task-childs-open', function(id) {
  check(id, String);
  return Tasks.find({ project_id:id, isChild:true, isComplete:false });
});

Meteor.publish('task-childs', function(task_id) {
  check(task_id, String);
  return Tasks.find({ parent_id:task_id });
});

Meteor.publish('project-progress-reports', function(id) {
  check(id, String);
  return ProgressReports.find({ project_id:id });
});

Meteor.publish('project-quotes', function(id) {
  check(id, String);
  return Quotes.find({ project_id:id });
});

Meteor.publish('project-quote', function(projectId, id) {
  check(projectId, String);
  check(id, String);
  return Quotes.find({ _id:id, project_id:projectId });
});

Meteor.publish('project-quote-items', function(projectId, quoteId) {
  check(projectId, String);
  check(quoteId, String);

  return QuoteItems.find({ quote_id:quoteId, project_id:projectId });
});
