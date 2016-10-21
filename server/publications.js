
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
  return Tasks.find({ project_id:id, parent:null });
});

Meteor.publish('task-childs-open', function(id) {
  check(id, String);
  return Tasks.find({ project_id:id, isChild:true, isComplete:false });
});

Meteor.publish('task-childs', function(task_id) {
  check(task_id, String);
  return Tasks.find({ parent:task_id });
});

Meteor.publish('project-progress-reports', function(id) {
  check(id, String);
  return ProgressReports.find({ project_id:id });
});
