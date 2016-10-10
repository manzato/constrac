Package.describe({
  name: 'manzato:tree-table',
  summary: 'Meteor package for displaying tree-tables',
  version: '1.0.0',
  git: 'https://github.com/manzato/meteor-tree-table'
});

Package.onUse(function(api) {
  api.versionsFrom('1.3.2.1');

  api.use([
    'underscore'
  ], 'client');

  api.addFiles('lib/tree-table.js', 'client');
});
