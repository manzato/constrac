
Meteor.publish('projects-all', function() {
  return Projects.find();
});

Meteor.publish('project-label', function(id) {
  return Projects.find({ _id:id }, { fields: { label:1 }});
});

Meteor.publish('project-single', function(id) {
  return Projects.find({ _id:id });
});

Meteor.publish('project-top-tasks', function(id) {
  return Tasks.find({ project_id:id });
});
