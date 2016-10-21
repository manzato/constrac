import { Template } from 'meteor/templating';
import './project_info.html';
import Gauge from '/imports/client/charts/gauge';
import Project from '/imports/common/project';
//import Logger from '/manzato/logging';

const logger = Logger.getLogger('projects:info');

var gauges = [];

function createGauge(name, label, min, max) {
  const config = {
    size: 120,
    label: label,
    min: undefined != min ? min : 0,
    max: undefined != max ? max : 100,
    minorTicks: 5
  }

  const range = config.max - config.min;
  config.yellowZones = [{ from: config.min + range*0.75, to: config.min + range*0.9 }];
  config.redZones = [{ from: config.min + range*0.9, to: config.max }];

  const gauge = new Gauge(name + "GaugeContainer", config);
  gauge.render();

  return gauge;
}

function createDeviationGauge(name, label, range) {

  const min = -1 * (range / 2);
  const max = (range / 2);

  const config = {
    size: 120,
    label: label,
    min: min,
    max: max,
    minorTicks: 5
  };

  const yellowRange = 0.40;
  const redRange = 0.20;

  config.redZones = [
    { from: config.min, to: config.min + range * redRange},
    { from: config.min + range* (1-redRange), to: config.max }
  ];

  config.yellowZones = [
    { from: config.min + range * redRange, to: config.min + range * yellowRange },
    { from: config.min + range * (1-yellowRange), to: config.min + range * (1-redRange)}
  ];

  config.greenZones = [
    { from: config.min + range * yellowRange, to: config.min + range * (1-yellowRange)}
  ];

  const gauge = new Gauge(name + "GaugeContainer", config);
  gauge.render();

  return gauge;
};

Template.ProjectInfo.onCreated( function() {
  const template = this;
  const project = template.data;

  this.subscribe('project-single', project._id, {
    onReady: () => {
      template.autorun( () => {
        if (project.isAtLeastStarted()) {
          const deviation = Projects.findOne({ _id:project._id }, {
            fields: { deviation:1 }
          }).deviation;
          template.deviationGauge && template.deviationGauge.redraw(project.deviation);
        }
      });
    }
  });
});

Template.ProjectInfo.onRendered( function() {
  const project = this.data;

  if (project.isAtLeastStarted()) {
    logger.debug('Creating deviation gauge');
    this.deviationGauge = createDeviationGauge("deviation", "Desviación", 50);
  }
});

Template.ProjectInfo.helpers({
});

Template.ProjectInfo.events({
  'click .start': () => {
    Iron.controller().startProject();
  },
  'click .restart': () => {
    Iron.controller().restartProject();
  },
  'click .pause': () => {
    Iron.controller().pauseProject();
  }
});
